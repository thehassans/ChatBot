import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Conversation, Workspace } from '@/lib/models';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = {};

    if (workspaceId) {
      // Verify user owns this workspace
      const workspace = await Workspace.findOne({ _id: workspaceId, userId: user.userId });
      if (!workspace) {
        return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
      }
      query.workspaceId = workspaceId;
    } else {
      // Get all workspaces for user
      const workspaces = await Workspace.find({ userId: user.userId }).select('_id');
      query.workspaceId = { $in: workspaces.map(w => w._id) };
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (channel && channel !== 'all') {
      query.channel = channel;
    }

    if (search) {
      query.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
        { lastMessagePreview: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Conversation.countDocuments(query);
    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('workspaceId', 'name')
      .lean();

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get conversations error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { workspaceId, channel, customer, channelId } = body;

    // Verify user owns this workspace
    const workspace = await Workspace.findOne({ _id: workspaceId, userId: user.userId });
    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const conversation = await Conversation.create({
      workspaceId,
      channel: channel || 'widget',
      channelId: channelId || `conv_${Date.now()}`,
      customer: customer || {},
      status: 'open',
      priority: 'medium',
      lastMessageAt: new Date(),
      unreadCount: 0,
      isBot: true,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error: any) {
    console.error('Create conversation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
