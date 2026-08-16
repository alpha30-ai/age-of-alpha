import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { novelId, message, history } = await request.json();

    if (!novelId || !message) {
      return NextResponse.json({ error: 'Missing novelId or message' }, { status: 400 });
    }

    // Get API Key
    const settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    if (!settings?.geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    // Fetch Novel Context for RAG
    const novel = await prisma.novel.findUnique({
      where: { id: novelId },
      include: {
        chapters: { select: { title: true, chapterNum: true, content: true }, orderBy: { chapterNum: 'asc' } },
        characters: { select: { name: true, description: true, faction: true, alliance: true } }
      }
    });

    if (!novel) {
      return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
    }

    // Prepare RAG Context (Limit content if too large, but Gemini handles 1M+ tokens easily)
    let contextStr = `أنت مساعد ذكاء اصطناعي خبير وراوي قصص محترف متخصص في رواية "${novel.title}".\n`;
    contextStr += `وصف الرواية: ${novel.description}\n\n`;
    
    contextStr += `الشخصيات في الرواية:\n`;
    novel.characters.forEach(c => {
      contextStr += `- ${c.name} (${c.faction}): ${c.description}\n`;
    });

    contextStr += `\nملخص الفصول المتاحة:\n`;
    novel.chapters.forEach(c => {
      contextStr += `فصل ${c.chapterNum} - ${c.title}:\n${c.content.substring(0, 500)}...\n\n`;
    });

    contextStr += `تعليمات هامة:\n`;
    contextStr += `1. أجب على أسئلة القارئ بدقة شديدة بناءً على المعلومات المقدمة فقط.\n`;
    contextStr += `2. استخدم أسلوباً مشوقاً، احترافياً، وغامضاً يناسب جو الفانتازيا المظلمة (Dark Fantasy).\n`;
    contextStr += `3. لا تقم بحرق أحداث لم يتم ذكرها في السياق، وتحدث وكأنك تعيش داخل هذا العالم.\n`;

    const genAI = new GoogleGenerativeAI(settings.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: contextStr });
    
    // Convert history to Gemini format
    const formattedHistory = history ? history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })) : [];

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const text = result.response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    // Fallback to gemini-1.5-flash if 2.5 is not available on their key
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      try {
        const { novelId, message, history } = await request.json();
        const settings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
        const genAI = new GoogleGenerativeAI(settings!.geminiApiKey!);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat();
        const result = await chat.sendMessage(message);
        return NextResponse.json({ reply: result.response.text() });
      } catch (fallbackErr) {
        return NextResponse.json({ error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي.' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
