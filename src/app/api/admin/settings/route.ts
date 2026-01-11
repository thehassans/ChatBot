import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { AdminSettings } from '@/lib/models';
import { authenticateAdminRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let settings = await AdminSettings.findOne({ key: 'main' });
    
    if (!settings) {
      settings = await AdminSettings.create({ key: 'main' });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateAdminRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { geminiApiKey, whatsappConfig, messengerConfig, emailConfig, globalBotSettings } = body;

    const settings = await AdminSettings.findOneAndUpdate(
      { key: 'main' },
      {
        $set: {
          ...(geminiApiKey !== undefined && { geminiApiKey }),
          ...(whatsappConfig && { whatsappConfig }),
          ...(messengerConfig && { messengerConfig }),
          ...(emailConfig && { emailConfig }),
          ...(globalBotSettings && { globalBotSettings }),
        },
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
