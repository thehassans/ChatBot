import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/magnetic-nobot';

const server = http.createServer();

const io = new SocketIOServer(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  sender: { type: String, enum: ['customer', 'agent', 'bot', 'system'], required: true },
  senderId: String,
  senderName: String,
  content: { type: String, required: true },
  contentType: { type: String, default: 'text' },
  status: { type: String, default: 'sent' },
  isInternal: { type: Boolean, default: false },
}, { timestamps: true });

const ConversationSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  channel: { type: String, required: true },
  channelId: { type: String, required: true },
  customer: {
    name: String,
    email: String,
    phone: String,
    ip: String,
    location: { country: String, city: String },
    device: { browser: String, os: String },
    pagesViewed: [{ url: String, title: String, timestamp: Date }],
  },
  status: { type: String, default: 'open' },
  lastMessageAt: { type: Date, default: Date.now },
  lastMessagePreview: String,
  unreadCount: { type: Number, default: 0 },
  isBot: { type: Boolean, default: true },
}, { timestamps: true });

const WorkspaceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  businessName: String,
  website: String,
  supportEmail: String,
  supportPhone: String,
  timezone: { type: String, default: 'UTC' },
  language: { type: String, default: 'en' },
  trainingData: {
    status: String,
    content: String,
  },
  botSettings: {
    enabled: { type: Boolean, default: true },
    replyDelay: { type: Number, default: 1500 },
    typingIndicatorDuration: { type: Number, default: 2000 },
  },
  widgetSettings: {
    agentName: { type: String, default: 'Support Agent' },
  },
  status: { type: String, default: 'active' },
});

const AdminSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main' },
  geminiApiKey: String,
  globalBotSettings: {
    defaultReplyDelay: { type: Number, default: 1500 },
    fallbackMessage: { type: String, default: 'I apologize, but I could not find information about that. Please contact our support team.' },
  },
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
const Workspace = mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema);
const AdminSettings = mongoose.models.AdminSettings || mongoose.model('AdminSettings', AdminSettingsSchema);

function generateBotPrompt(workspace: any): string {
  const businessName = workspace.businessName || workspace.name || 'Our Company';
  const agentName = workspace.widgetSettings?.agentName || 'Support Agent';
  const website = workspace.website || '';
  const supportEmail = workspace.supportEmail || '';
  const trainingData = workspace.trainingData?.content || '';

  return `Just like a real human customer support representative working for ${businessName}.

CRITICAL IDENTITY RULES (NON-NEGOTIABLE)
- You are a real person, not an AI, not a bot, not a model.
- If asked "are you a bot/AI?", you must say you are a real human support agent.
- Never mention: AI, language model, prompts, system messages, policies, "as an AI", or anything similar.
- Do not use emojis.

ROLE
- You are assigned support agent: ${agentName}
- Write like a human in live chat: natural, short sentences.
- Default length: 2-4 sentences. Use steps/bullets only when needed.

SCOPE
- You ONLY help with ${businessName} services, products, website, pricing, policies, and support.
- If user asks unrelated topics, redirect them back to business support.

STRICT KNOWLEDGE RULE (MOST IMPORTANT)
- You must answer ONLY using:
  1) Business Knowledge Base (TRAINING_DATA) provided below
  2) the conversation history provided to you
- If the answer is not clearly in the knowledge base or chat history:
  - say you don't have enough information
  - ask 1-2 short clarifying questions OR offer the official support channel
- Never invent prices, policies, guarantees, contact details, or technical capabilities.

PRIVACY & SECURITY
- Never ask for or expose: passwords, OTP codes, private keys, full card numbers.
- If user shares sensitive data, ask them to remove it and use official support channels.

HUMAN HANDOFF
- If the user requests escalation, is angry, or needs account-specific actions:
  - Apologize briefly
  - Ask for minimal info (order id / account email)
  - Direct them to support email or ticket flow

OUTPUT RULES
- Plain text only.
- No markdown formatting.
- No emojis.
- Be polite, confident, and practical.

BUSINESS CONTEXT
Business name: ${businessName}
Website: ${website}
Support email: ${supportEmail}

Business Knowledge Base (TRAINING_DATA)
Use the following as the only source of truth about the business:
${trainingData}`;
}

async function generateBotResponse(
  workspace: any,
  conversationHistory: any[],
  userMessage: string
): Promise<string> {
  try {
    const adminSettings = await AdminSettings.findOne({ key: 'main' });
    const apiKey = adminSettings?.geminiApiKey;

    if (!apiKey) {
      return adminSettings?.globalBotSettings?.fallbackMessage || 
        'Thank you for your message. Our team will get back to you shortly.';
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const systemPrompt = generateBotPrompt(workspace);
    
    const historyContext = conversationHistory
      .slice(-10)
      .map(msg => `${msg.sender === 'customer' ? 'Customer' : 'Agent'}: ${msg.content}`)
      .join('\n');

    const prompt = `${systemPrompt}

CONVERSATION HISTORY:
${historyContext}

Customer: ${userMessage}

Agent response (remember: plain text, no emojis, 2-4 sentences, human-like):`;

    const result = await model.generateContent(prompt);
    let response = result.response.text().trim();

    response = response
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[*_#`]/g, '')
      .trim();

    return response || 'Thank you for reaching out. How can I help you today?';
  } catch (error) {
    console.error('Bot response error:', error);
    return 'Thank you for your message. Let me look into that for you. Is there anything specific you would like to know?';
  }
}

const workspaceRooms = new Map<string, Set<string>>();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join:workspace', async (workspaceId: string) => {
    socket.join(`workspace:${workspaceId}`);
    
    if (!workspaceRooms.has(workspaceId)) {
      workspaceRooms.set(workspaceId, new Set());
    }
    workspaceRooms.get(workspaceId)?.add(socket.id);
    
    console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
  });

  socket.on('join:conversation', async (conversationId: string) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on('message:send', async (data: {
    workspaceId: string;
    conversationId?: string;
    channelId: string;
    channel: string;
    content: string;
    sender: string;
    senderName?: string;
    customer?: any;
  }) => {
    try {
      const { workspaceId, channelId, channel, content, sender, senderName, customer } = data;
      let { conversationId } = data;

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace || workspace.status !== 'active') {
        socket.emit('error', { message: 'Workspace not available' });
        return;
      }

      let conversation;
      
      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
      }
      
      if (!conversation) {
        conversation = await Conversation.findOne({ workspaceId, channelId, channel });
      }

      if (!conversation) {
        conversation = await Conversation.create({
          workspaceId,
          channel,
          channelId,
          customer: customer || {},
          status: 'open',
          isBot: workspace.botSettings?.enabled !== false,
        });
      }

      const message = await Message.create({
        conversationId: conversation._id,
        workspaceId,
        sender,
        senderName: senderName || customer?.name || 'Customer',
        content,
        contentType: 'text',
        status: 'sent',
      });

      conversation.lastMessageAt = new Date();
      conversation.lastMessagePreview = content.substring(0, 100);
      if (sender === 'customer') {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
      await conversation.save();

      const messageData = {
        _id: message._id.toString(),
        conversationId: conversation._id.toString(),
        workspaceId,
        sender,
        senderName: message.senderName,
        content,
        contentType: 'text',
        status: 'sent',
        createdAt: message.createdAt,
      };

      io.to(`conversation:${conversation._id}`).emit('message:new', messageData);
      io.to(`workspace:${workspaceId}`).emit('conversation:update', {
        conversationId: conversation._id.toString(),
        lastMessageAt: conversation.lastMessageAt,
        lastMessagePreview: conversation.lastMessagePreview,
        unreadCount: conversation.unreadCount,
      });

      socket.emit('message:sent', { 
        messageId: message._id.toString(),
        conversationId: conversation._id.toString(),
      });

      if (sender === 'customer' && conversation.isBot && workspace.botSettings?.enabled !== false) {
        const replyDelay = workspace.botSettings?.replyDelay || 1500;
        const typingDuration = workspace.botSettings?.typingIndicatorDuration || 2000;

        io.to(`conversation:${conversation._id}`).emit('typing:start', {
          conversationId: conversation._id.toString(),
          sender: 'bot',
        });

        const history = await Message.find({ conversationId: conversation._id })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean();

        const botResponse = await generateBotResponse(
          workspace,
          history.reverse(),
          content
        );

        await new Promise(resolve => setTimeout(resolve, replyDelay + typingDuration));

        io.to(`conversation:${conversation._id}`).emit('typing:stop', {
          conversationId: conversation._id.toString(),
          sender: 'bot',
        });

        const botMessage = await Message.create({
          conversationId: conversation._id,
          workspaceId,
          sender: 'bot',
          senderName: workspace.widgetSettings?.agentName || 'Support Agent',
          content: botResponse,
          contentType: 'text',
          status: 'sent',
        });

        conversation.lastMessageAt = new Date();
        conversation.lastMessagePreview = botResponse.substring(0, 100);
        await conversation.save();

        const botMessageData = {
          _id: botMessage._id.toString(),
          conversationId: conversation._id.toString(),
          workspaceId,
          sender: 'bot',
          senderName: botMessage.senderName,
          content: botResponse,
          contentType: 'text',
          status: 'sent',
          createdAt: botMessage.createdAt,
        };

        io.to(`conversation:${conversation._id}`).emit('message:new', botMessageData);
        io.to(`workspace:${workspaceId}`).emit('conversation:update', {
          conversationId: conversation._id.toString(),
          lastMessageAt: conversation.lastMessageAt,
          lastMessagePreview: conversation.lastMessagePreview,
        });
      }
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing:start', (data: { conversationId: string; sender: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('typing:start', data);
  });

  socket.on('typing:stop', (data: { conversationId: string; sender: string }) => {
    socket.to(`conversation:${data.conversationId}`).emit('typing:stop', data);
  });

  socket.on('conversation:read', async (data: { conversationId: string }) => {
    try {
      await Conversation.findByIdAndUpdate(data.conversationId, { unreadCount: 0 });
      socket.emit('conversation:read:success', { conversationId: data.conversationId });
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    workspaceRooms.forEach((sockets, workspaceId) => {
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        workspaceRooms.delete(workspaceId);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

export { io, server };
