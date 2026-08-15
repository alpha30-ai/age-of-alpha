import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { targetType, targetId, platform } = body;

    if (!targetType || !targetId || !platform) {
      return NextResponse.json({ error: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // Get settings
    const systemSettings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    
    if (!systemSettings?.geminiApiKey) {
      return NextResponse.json({ error: 'مفتاح Gemini API Key غير متوفر في إعدادات النظام' }, { status: 400 });
    }

    let targetData: any = null;
    let promptContext = '';

    if (targetType === 'CHAPTER') {
      targetData = await prisma.chapter.findUnique({ where: { id: targetId } });
      if (!targetData) return NextResponse.json({ error: 'الفصل غير موجود' }, { status: 404 });
      promptContext = "فصل رواية عهد ألفا رقم " + targetData.chapterNum + " بعنوان " + targetData.title + ". المحتوى: " + targetData.content.substring(0, 1500);
    } else if (targetType === 'CHARACTER') {
      targetData = await prisma.character.findUnique({ where: { id: targetId } });
      if (!targetData) return NextResponse.json({ error: 'الشخصية غير موجودة' }, { status: 404 });
      promptContext = "شخصية من رواية عهد ألفا. الاسم: " + targetData.name + ". الدور: " + targetData.role + ". السلاح: " + targetData.weapon + ". الوصف: " + targetData.description;
    } else if (targetType === 'VIDEO') {
      targetData = await prisma.videoMedia.findUnique({ where: { id: targetId } });
      if (!targetData) return NextResponse.json({ error: 'الفيديو غير موجود' }, { status: 404 });
      promptContext = "فيديو من رواية عهد ألفا. العنوان: " + targetData.title + ". الوصف: " + (targetData.description || 'لا يوجد');
    }

    const systemPrompt = "أنت خبير تسويق عبقري لرواية دارك فانتسي تسمى عهد ألفا.\n" +
      "بناء على المحتوى التالي، قم بإنشاء إعدادات نشر لمنصة " + (platform === 'YOUTUBE' ? 'يوتيوب' : 'فيسبوك') + ".\n" +
      "المحتوى:\n" + promptContext + "\n\n" +
      "يجب أن يكون ردك بصيغة JSON حصراً، يحتوي على:\n" +
      '{\n' +
      '  "title": "عنوان جذاب جدا ومثير",\n' +
      '  "description": "وصف احترافي يشوق المتابعين مع دعوة للاشتراك",\n' +
      '  "hashtags": "#عهد_ألفا #رواية_خيال وغيرها",\n' +
      '  "thumbnailPrompt": "وصف بصري دقيق باللغة الإنجليزية لتوليد صورة مصغرة (Thumbnail) تناسب المشهد أو الشخصية، ركز على الإضاءة، الطابع السينمائي، دارك فانتسي."\n' +
      '}';

    const cleanApiKey = systemSettings.geminiApiKey.trim();
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
    
    const geminiRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': cleanApiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }]
      })
    });

    const geminiData = await geminiRes.json();
    
    if (!geminiRes.ok) {
      throw new Error(geminiData.error?.message || 'فشل الاتصال بـ Gemini API');
    }

    const text = geminiData.candidates[0].content.parts[0].text;
    
    // Extract JSON block in case model added markdown wrapping
    let rawJson = text;
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      rawJson = jsonMatch[1];
    }
    
    const parsed = JSON.parse(rawJson);

    return NextResponse.json({ success: true, data: parsed });

  } catch (error: any) {
    console.error('Gemini Generate Error:', error);
    return NextResponse.json({ error: `حدث خطأ: ${error.message || 'مشكلة غير معروفة في التوليد'}` }, { status: 500 });
  }
}
