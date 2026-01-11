import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Workspace, Conversation, Message, AdminSettings } from '@/lib/models';
import { GoogleGenAI } from '@google/genai';

// POST - Send a message to the chatbot and get AI response
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await connectDB();
    
    const { message, sessionId, customerInfo } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const workspace = await Workspace.findById(params.workspaceId);
    
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if widget is enabled
    if (!workspace.channels?.widget?.connected && !workspace.allowedChannels?.includes('widget')) {
      return NextResponse.json(
        { error: 'Widget not enabled' },
        { status: 403 }
      );
    }

    // Find or create conversation for this session
    let conversation = await Conversation.findOne({
      workspaceId: params.workspaceId,
      'customer.sessionId': sessionId,
      channel: 'widget',
      status: { $ne: 'resolved' }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        workspaceId: params.workspaceId,
        channel: 'widget',
        customer: {
          sessionId: sessionId,
          name: customerInfo?.name || 'Website Visitor',
          email: customerInfo?.email,
        },
        status: 'open',
        lastMessageAt: new Date(),
        unreadCount: 1,
      });
    }

    // Save user message
    await Message.create({
      conversationId: conversation._id,
      workspaceId: params.workspaceId,
      sender: 'customer',
      content: message,
      contentType: 'text',
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessageAt: new Date(),
      $inc: { unreadCount: 1 },
    });

    // Generate AI response using training data
    let aiResponse = "Thank you for your message. Our team will get back to you shortly.";

    try {
      // Get Gemini API key from settings
      const settings = await AdminSettings.findOne({});
      const apiKey = settings?.geminiApiKey;

      if (apiKey && workspace.trainingData?.processedContent) {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a helpful customer support assistant for ${workspace.businessName || 'our company'}. 
Use the following knowledge base to answer the customer's question. Be friendly, helpful, and concise.
If you don't know the answer based on the knowledge base, politely say so and offer to connect them with a human agent.

Knowledge Base:
${workspace.trainingData.processedContent}

Customer Message: ${message}

Response:`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: prompt,
        });
        aiResponse = response.text || aiResponse;
      }
    } catch (aiError) {
      console.error('AI response error:', aiError);
      // Use default response if AI fails
    }

    // Save bot response
    await Message.create({
      conversationId: conversation._id,
      workspaceId: params.workspaceId,
      sender: 'bot',
      content: aiResponse,
      contentType: 'text',
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error('Widget chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

// GET - Get conversation history for a session
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const conversation = await Conversation.findOne({
      workspaceId: params.workspaceId,
      'customer.sessionId': sessionId,
      channel: 'widget',
    }).sort({ createdAt: -1 });

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      conversationId: conversation._id,
      messages: messages.map(m => ({
        id: m._id,
        sender: m.sender,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}
