import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Workspace } from '@/lib/models';

// GET - Serve widget configuration
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    await connectDB();
    
    const workspace = await Workspace.findById(params.workspaceId);
    
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if widget channel is enabled
    const widgetChannel = workspace.channels?.widget;
    if (!widgetChannel?.connected && !workspace.allowedChannels?.includes('widget')) {
      return NextResponse.json(
        { error: 'Widget not enabled for this workspace' },
        { status: 403 }
      );
    }

    // Return widget configuration
    return NextResponse.json({
      workspaceId: workspace._id,
      businessName: workspace.businessName || 'Support',
      welcomeMessage: workspace.widgetSettings?.greeting || 'Hello! How can I help you today?',
      widgetConfig: {
        primaryColor: workspace.widgetSettings?.primaryColor || '#6366f1',
        position: workspace.widgetSettings?.position || 'right',
        greeting: workspace.widgetSettings?.greeting || 'Hi there! 👋',
        placeholder: workspace.widgetSettings?.placeholder || 'Type your message...',
        agentName: workspace.widgetSettings?.agentName || 'Support Agent',
        agentAvatar: workspace.widgetSettings?.agentAvatar,
      }
    });
  } catch (error) {
    console.error('Widget config error:', error);
    return NextResponse.json(
      { error: 'Failed to load widget configuration' },
      { status: 500 }
    );
  }
}
