import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, authenticateAdminRequest } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import connectDB from '@/lib/db';
import { AdminSettings } from '@/lib/models';

export async function POST(request: NextRequest) {
  try {
    // Allow both admin and regular users to test connection
    let user = await authenticateAdminRequest(request);
    let apiKey: string | undefined;
    
    if (user) {
      // Admin can provide a new API key to test
      try {
        const body = await request.json();
        apiKey = body.apiKey;
      } catch {
        // No body provided, will use saved key
      }
    } else {
      // Regular user - authenticate and use saved key
      user = await authenticateRequest(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // If no API key provided, get from admin settings
    if (!apiKey) {
      await connectDB();
      const adminSettings = await AdminSettings.findOne({ key: 'main' });
      apiKey = adminSettings?.geminiApiKey;
    }

    if (!apiKey || apiKey.trim().length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Gemini API key not configured. Contact administrator.' 
      }, { status: 400 });
    }

    // Test the API key by making a simple request
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Say "Connection successful!" in exactly those words.',
    });

    if (response.text) {
      return NextResponse.json({
        success: true,
        message: 'Gemini API connection successful!',
        model: 'gemini-2.0-flash',
      });
    } else {
      throw new Error('Empty response from API');
    }
  } catch (error: any) {
    console.error('Gemini test error:', error);
    
    let errorMessage = 'Connection failed';
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ 
      success: false,
      error: errorMessage 
    }, { status: 400 });
  }
}
