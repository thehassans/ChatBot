import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Workspace } from '@/lib/models';
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

    const workspace = await Workspace.findOne({
      _id: params.id,
      userId: user.userId,
    }).lean();

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ workspace });
  } catch (error: any) {
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

    const body = await request.json();
    const {
      businessName,
      supportEmail,
      timezone,
      welcomeMessage,
      setupStep,
      setupCompleted,
    } = body;

    const workspace = await Workspace.findOneAndUpdate(
      { _id: params.id, userId: user.userId },
      {
        $set: {
          ...(businessName !== undefined && { businessName }),
          ...(supportEmail !== undefined && { supportEmail }),
          ...(timezone !== undefined && { timezone }),
          ...(welcomeMessage !== undefined && { welcomeMessage }),
          ...(setupStep !== undefined && { setupStep }),
          ...(setupCompleted !== undefined && { setupCompleted }),
        },
      },
      { new: true }
    );

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, workspace });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
