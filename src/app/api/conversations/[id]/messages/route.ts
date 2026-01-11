import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Conversation, Message, Workspace, AdminSettings } from '@/lib/models';
import { authenticateRequest } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversation = await Conversation.findById(params.id);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verify user owns the workspace
    const workspace = await Workspace.findOne({ 
      _id: conversation.workspaceId, 
      userId: user.userId 
    });
    
    if (!workspace) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    const total = await Message.countDocuments({ conversationId: params.id });
    const messages = await Message.find({ conversationId: params.id })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Mark as read
    await Conversation.findByIdAndUpdate(params.id, { unreadCount: 0 });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversation = await Conversation.findById(params.id);
    
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verify user owns the workspace
    const workspace = await Workspace.findOne({ 
      _id: conversation.workspaceId, 
      userId: user.userId 
    });
    
    if (!workspace) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { content, sender = 'agent', contentType = 'text' } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Create the message
    const message = await Message.create({
      conversationId: params.id,
      workspaceId: conversation.workspaceId,
      sender,
      senderName: sender === 'agent' ? user.name : undefined,
      content,
      contentType,
      status: 'sent',
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(params.id, {
      lastMessageAt: new Date(),
      lastMessagePreview: content.substring(0, 100),
    });

    // If this is a customer message and bot is enabled, generate AI response
    if (sender === 'customer' && conversation.isBot && workspace.knowledgeBase) {
      try {
        const adminSettings = await AdminSettings.findOne({});
        if (adminSettings?.geminiApiKey) {
          const ai = new GoogleGenAI({ apiKey: adminSettings.geminiApiKey });
          
          const systemPrompt = `You are a helpful customer support AI assistant for ${workspace.businessName || 'this business'}. 
Use the following knowledge base to answer questions accurately and helpfully.
If you don't know the answer, politely say so and offer to connect them with a human agent.

Knowledge Base:
${workspace.knowledgeBase}

Welcome Message: ${workspace.botSettings?.welcomeMessage || 'Hello! How can I help you today?'}`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemPrompt}\n\nCustomer: ${content}\n\nAssistant:`,
          });

          const botReply = response.text;

          if (botReply) {
            await Message.create({
              conversationId: params.id,
              workspaceId: conversation.workspaceId,
              sender: 'bot',
              content: botReply,
              contentType: 'text',
              status: 'sent',
            });

            await Conversation.findByIdAndUpdate(params.id, {
              lastMessageAt: new Date(),
              lastMessagePreview: botReply.substring(0, 100),
            });
          }
        }
      } catch (aiError) {
        console.error('AI response error:', aiError);
      }
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: any) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
