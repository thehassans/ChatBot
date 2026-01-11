import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Conversation, Message, Workspace } from '@/lib/models';
import { authenticateRequest } from '@/lib/auth';

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

    const conversation = await Conversation.findById(params.id).populate('workspaceId', 'name userId');
    
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

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Get conversation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
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
    const allowedUpdates = ['status', 'priority', 'tags', 'assignedTo', 'unreadCount'];
    
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        (conversation as any)[key] = body[key];
      }
    }

    await conversation.save();

    return NextResponse.json({ conversation });
  } catch (error: any) {
    console.error('Update conversation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
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

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: params.id });
    
    // Delete the conversation
    await Conversation.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete conversation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
