import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Workspace, AdminSettings } from '@/lib/models';
import { authenticateRequest } from '@/lib/auth';
import { GoogleGenAI } from '@google/genai';
import * as cheerio from 'cheerio';

async function scrapeWebsite(url: string): Promise<string> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

    // Use realistic browser headers to avoid 403 blocks
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Website blocked access. Try using Text Content instead, or use a different URL.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    if (!html || html.length < 100) {
      throw new Error('Empty or invalid response from website');
    }

    const $ = cheerio.load(html);
    
    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, iframe, noscript, svg, img, link, meta').remove();
    
    // Extract meaningful content
    const title = $('title').text().trim() || 'Untitled';
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    
    // Get body text
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    
    const text = `Website: ${url}
Title: ${title}
${metaDesc ? `Description: ${metaDesc}` : ''}

Content:
${bodyText}`.substring(0, 50000);
    
    return text;
  } catch (error: any) {
    console.error('Scrape error:', error.message);
    if (error.name === 'AbortError') {
      throw new Error('Website took too long to respond');
    }
    throw new Error(`Failed to scrape: ${error.message}`);
  }
}

async function processWithGemini(content: string, apiKey: string, businessContext?: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert knowledge base architect for customer support AI systems. Your task is to analyze the provided content and create a HIGHLY ACCURATE, comprehensive knowledge base optimized for an AI chatbot.

IMPORTANT GUIDELINES:
- Extract ALL factual information with 100% accuracy
- Preserve exact numbers, prices, dates, names, and technical specifications
- Maintain the original meaning without interpretation or assumption
- Structure information in Q&A format where possible
- Include every detail that could help answer customer questions
- Flag any ambiguous information that needs verification

EXTRACT AND ORGANIZE:
1. **Company/Brand Information**: Name, mission, values, history
2. **Products/Services**: Complete descriptions, features, specifications
3. **Pricing**: All prices, packages, tiers, discounts (exact amounts)
4. **Policies**: Returns, refunds, shipping, warranty, privacy, terms
5. **FAQs**: Common questions and their precise answers
6. **Contact Information**: Email, phone, hours, locations, social media
7. **Processes**: How to order, sign up, get support, etc.
8. **Technical Details**: Requirements, compatibility, limitations

FORMAT OUTPUT AS:
- Use clear categories and subcategories
- Write in factual, direct statements
- Include original quotes when accuracy is critical
- List items with bullet points for easy parsing

${businessContext ? `Business Context: ${businessContext}\n` : ''}

CONTENT TO ANALYZE:
${content}

---
OUTPUT THE COMPREHENSIVE KNOWLEDGE BASE:`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    
    const text = response.text;
    
    if (!text || text.length < 50) {
      throw new Error('Failed to generate knowledge base - empty response');
    }
    
    return text;
  } catch (error: any) {
    console.error('Gemini API error:', error);
    throw new Error(`Gemini API failed: ${error.message || 'Unknown error'}`);
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

    const workspace = await Workspace.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Handle both frontend formats: {type, url, content} or {source, sourceValue}
    const type = body.type || body.source;
    const sourceValue = body.url || body.content || body.sourceValue;

    if (!type) {
      return NextResponse.json({ error: 'Training type is required' }, { status: 400 });
    }

    if (!sourceValue || sourceValue.trim().length === 0) {
      return NextResponse.json({ error: 'Training content is required' }, { status: 400 });
    }

    // Update status to processing
    workspace.trainingData = {
      status: 'processing',
      source: type,
      sourceValue: sourceValue,
      startedAt: new Date(),
    };
    await workspace.save();

    let content = '';

    try {
      if (type === 'url') {
        console.log('Scraping URL:', sourceValue);
        content = await scrapeWebsite(sourceValue);
        
        if (!content || content.trim().length < 100) {
          throw new Error('Could not extract meaningful content from the website');
        }
        console.log('Scraped content length:', content.length);
      } else {
        // text or file content
        content = sourceValue;
      }

      // Get Gemini API key from admin settings
      const adminSettings = await AdminSettings.findOne({ key: 'main' });
      const geminiApiKey = adminSettings?.geminiApiKey;

      let processedContent = content;

      if (geminiApiKey) {
        console.log('Processing with Gemini...');
        try {
          processedContent = await processWithGemini(content, geminiApiKey, workspace.businessName);
        } catch (geminiError: any) {
          console.error('Gemini processing failed, using raw content:', geminiError.message);
          // Fall back to using raw content if Gemini fails
          processedContent = content;
        }
      } else {
        console.log('No Gemini API key configured, storing raw content');
      }

      workspace.trainingData = {
        status: 'completed',
        source: type,
        sourceValue: sourceValue,
        rawContent: content.substring(0, 10000),
        processedContent: processedContent,
        processedAt: new Date(),
        contentLength: processedContent.length,
      };
      workspace.knowledgeBase = processedContent;
      workspace.setupStep = Math.max(workspace.setupStep || 1, 2);
      await workspace.save();

      return NextResponse.json({
        success: true,
        message: geminiApiKey ? 'Training completed with AI processing!' : 'Training saved (configure Gemini API for AI processing)',
        contentLength: processedContent.length,
      });
      
    } catch (processingError: any) {
      console.error('Processing error:', processingError);
      
      workspace.trainingData = {
        ...workspace.trainingData,
        status: 'failed',
        error: processingError.message,
      };
      await workspace.save();
      
      // Provide helpful error message for scraping failures
      let errorMessage = processingError.message;
      if (type === 'url' && (errorMessage.includes('403') || errorMessage.includes('blocked') || errorMessage.includes('Forbidden'))) {
        errorMessage = 'This website blocks automated access. Please use "Text Content" tab and paste the content directly.';
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        suggestion: type === 'url' ? 'Try using Text Content instead' : undefined
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Training error:', error);
    return NextResponse.json({ error: error.message || 'Training failed' }, { status: 500 });
  }
}
