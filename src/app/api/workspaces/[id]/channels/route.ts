import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Workspace } from '@/lib/models';
import { authenticateRequest } from '@/lib/auth';

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

    const workspace = await Workspace.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const { channel, action, credentials } = await request.json();

    if (!channel || !action) {
      return NextResponse.json({ error: 'Channel and action are required' }, { status: 400 });
    }

    if (action === 'connect') {
      // Check if demo mode (no credentials provided or demo flag)
      const isDemoMode = credentials?.demoMode === true;

      // Validate credentials based on channel type
      if (channel === 'whatsapp') {
        if (isDemoMode) {
          // Demo mode - connect without validation
          workspace.channels.whatsapp = {
            enabled: true,
            connected: true,
            config: {
              phoneNumberId: 'demo_phone_number_id',
              accessToken: 'demo_access_token',
              businessAccountId: '',
              webhookVerifyToken: generateVerifyToken(),
              connectedAt: new Date(),
              demoMode: true,
            },
          };
        } else {
          if (!credentials?.phoneNumberId || !credentials?.accessToken) {
            return NextResponse.json({ 
              error: 'WhatsApp requires Phone Number ID and Access Token' 
            }, { status: 400 });
          }

          // Test WhatsApp connection
          try {
            const testResponse = await fetch(
              `https://graph.facebook.com/v18.0/${credentials.phoneNumberId}`,
              {
                headers: {
                  'Authorization': `Bearer ${credentials.accessToken}`,
                },
              }
            );

            if (!testResponse.ok) {
              const errorData = await testResponse.json();
              throw new Error(errorData.error?.message || 'Invalid credentials');
            }

            // Connection successful - save credentials
            workspace.channels.whatsapp = {
              enabled: true,
              connected: true,
              config: {
                phoneNumberId: credentials.phoneNumberId,
                accessToken: credentials.accessToken,
                businessAccountId: credentials.businessAccountId || '',
                webhookVerifyToken: credentials.webhookVerifyToken || generateVerifyToken(),
                connectedAt: new Date(),
              },
            };
          } catch (error: any) {
            return NextResponse.json({ 
              error: `WhatsApp connection failed: ${error.message}` 
            }, { status: 400 });
          }
        }
      }

      if (channel === 'messenger') {
        if (isDemoMode) {
          // Demo mode - connect without validation
          workspace.channels.messenger = {
            enabled: true,
            connected: true,
            config: {
              pageId: 'demo_page_id',
              pageAccessToken: 'demo_page_access_token',
              pageName: 'Demo Page',
              appId: '',
              appSecret: '',
              webhookVerifyToken: generateVerifyToken(),
              connectedAt: new Date(),
              demoMode: true,
            },
          };
        } else {
          if (!credentials?.pageId || !credentials?.pageAccessToken) {
            return NextResponse.json({ 
              error: 'Messenger requires Page ID and Page Access Token' 
            }, { status: 400 });
          }

          // Test Messenger connection
          try {
            const testResponse = await fetch(
              `https://graph.facebook.com/v18.0/${credentials.pageId}?fields=name,id&access_token=${credentials.pageAccessToken}`
            );

            if (!testResponse.ok) {
              const errorData = await testResponse.json();
              throw new Error(errorData.error?.message || 'Invalid credentials');
            }

            const pageData = await testResponse.json();

            // Connection successful - save credentials
            workspace.channels.messenger = {
              enabled: true,
              connected: true,
              config: {
                pageId: credentials.pageId,
                pageAccessToken: credentials.pageAccessToken,
                pageName: pageData.name || '',
                appId: credentials.appId || '',
                appSecret: credentials.appSecret || '',
                webhookVerifyToken: credentials.webhookVerifyToken || generateVerifyToken(),
                connectedAt: new Date(),
              },
            };
          } catch (error: any) {
            return NextResponse.json({ 
              error: `Messenger connection failed: ${error.message}` 
            }, { status: 400 });
          }
        }
      }

      if (channel === 'widget') {
        workspace.channels.widget = {
          enabled: true,
          connected: true,
          config: {
            connectedAt: new Date(),
          },
        };
      }

      await workspace.save();

      return NextResponse.json({
        success: true,
        message: `${channel} connected successfully!${isDemoMode ? ' (Demo Mode)' : ''}`,
        channel: workspace.channels[channel as keyof typeof workspace.channels],
      });
    }

    if (action === 'disconnect') {
      if (workspace.channels[channel as keyof typeof workspace.channels]) {
        workspace.channels[channel as keyof typeof workspace.channels] = {
          enabled: false,
          connected: false,
          config: {},
        };
        await workspace.save();
      }

      return NextResponse.json({
        success: true,
        message: `${channel} disconnected successfully!`,
      });
    }

    if (action === 'test') {
      const channelConfig = workspace.channels[channel as keyof typeof workspace.channels];
      
      if (!channelConfig?.connected) {
        return NextResponse.json({ 
          error: `${channel} is not connected` 
        }, { status: 400 });
      }

      // Test the connection
      if (channel === 'whatsapp') {
        try {
          const testResponse = await fetch(
            `https://graph.facebook.com/v18.0/${channelConfig.config.phoneNumberId}`,
            {
              headers: {
                'Authorization': `Bearer ${channelConfig.config.accessToken}`,
              },
            }
          );

          if (!testResponse.ok) {
            throw new Error('Connection test failed');
          }

          return NextResponse.json({
            success: true,
            message: 'WhatsApp connection is working!',
          });
        } catch (error) {
          return NextResponse.json({ 
            success: false,
            error: 'WhatsApp connection test failed' 
          }, { status: 400 });
        }
      }

      if (channel === 'messenger') {
        try {
          const testResponse = await fetch(
            `https://graph.facebook.com/v18.0/${channelConfig.config.pageId}?access_token=${channelConfig.config.pageAccessToken}`
          );

          if (!testResponse.ok) {
            throw new Error('Connection test failed');
          }

          return NextResponse.json({
            success: true,
            message: 'Messenger connection is working!',
          });
        } catch (error) {
          return NextResponse.json({ 
            success: false,
            error: 'Messenger connection test failed' 
          }, { status: 400 });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Connection is working!',
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Channel connection error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateVerifyToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
