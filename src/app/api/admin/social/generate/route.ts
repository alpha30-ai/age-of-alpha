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

    const systemPrompt = "أنت خبير تسويق و SEO عبقري لرواية دارك فانتسي تسمى (عهد ألفا).\n" +
      "بناء على المحتوى التالي، قم بإنشاء منشور إبداعي لمنصة " + (platform === 'YOUTUBE' ? 'يوتيوب' : 'فيسبوك') + ".\n" +
      "المحتوى:\n" + promptContext + "\n\n" +
      "الشروط الصارمة:\n" +
      "1. ممنوع تماماً استخدام علامات النجوم ** أو أي تنسيقات Markdown أخرى.\n" +
      "2. استخدم رموز تعبيرية (Emojis) احترافية ومتناسقة مع جو الرواية (الغموض، الملحمة، السحر).\n" +
      "3. يجب أن تكون الكلمات المفتاحية (Hashtags) والعنوان قوية جداً وتتصدر نتائج البحث (SEO Optimized).\n" +
      "4. يجب أن يكون ردك بصيغة JSON حصراً، ويحتوي على:\n" +
      '{\n' +
      '  "title": "عنوان جذاب جداً ومثير للاهتمام ويجذب النقرات",\n' +
      '  "description": "وصف احترافي يشوق المتابعين مع دعوة قوية للاشتراك والمتابعة، منسق بالرموز التعبيرية وبدون أي علامات نجوم",\n' +
      '  "hashtags": "#عهد_ألفا #رواية_خيال #دارك_فانتسي وغيرها",\n' +
      '  "youtubeTags": "خيال, اكشن, عهد الفا, ملحمة, قصة (بدون علامة الشباك ومفصولة بفاصلة لليوتيوب فقط)",\n' +
      '  "thumbnailPrompt": "وصف بصري دقيق باللغة الإنجليزية لتوليد صورة مصغرة (Thumbnail) تناسب المشهد أو الشخصية، ركز على الإضاءة، الطابع السينمائي، دارك فانتسي."\n' +
      '}';

    const cleanApiKey = systemSettings.geminiApiKey.trim();
    
    // Initialize the official SDK
    const genAI = new GoogleGenerativeAI(cleanApiKey);
    
    // Try primary model first
    let model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let result;
    
    try {
      result = await model.generateContent(systemPrompt);
    } catch (e: any) {
      console.log('Error with gemini-2.5-flash, trying fallback...', e.message);
      // Fallback to older or specific models if the main one fails
      try {
        model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
        result = await model.generateContent(systemPrompt);
      } catch (fallbackError: any) {
        console.log('Error with gemini-3.5-flash, trying gemini-flash-latest...', fallbackError.message);
        model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        result = await model.generateContent(systemPrompt);
      }
    }

    if (!result || !result.response) {
      throw new Error('لم يقم الذكاء الاصطناعي بتوليد أي محتوى.');
    }

    const text = result.response.text() || '';
    if (!text) {
      throw new Error('الاستجابة كانت فارغة من النص.');
    }
    
    // Extract JSON block in case model added markdown wrapping
    let rawJson = text.trim();
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      rawJson = jsonMatch[1].trim();
    }
    
    // Sometimes the model outputs extra characters before or after the {}
    const firstBrace = rawJson.indexOf('{');
    const lastBrace = rawJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      rawJson = rawJson.substring(firstBrace, lastBrace + 1);
    }

    let parsed;
    try {
      parsed = JSON.parse(rawJson);
    } catch (parseError) {
      console.error('Failed to parse JSON:', rawJson);
      throw new Error('لم يكن التنسيق المسترد JSON صالحاً. برجاء المحاولة مرة أخرى.');
    }

    return NextResponse.json({ success: true, data: parsed });

  } catch (error: any) {
    console.error('Gemini Generate Error:', error);
    return NextResponse.json({ error: `حدث خطأ: ${error.message || 'مشكلة غير معروفة في التوليد'}` }, { status: 500 });
  }
}
