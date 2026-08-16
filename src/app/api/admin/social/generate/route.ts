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
      '  "thumbnailPrompt": "وصف بصري دقيق باللغة الإنجليزية لتوليد صورة مصغرة (Thumbnail) تناسب المشهد أو الشخصية، ركز على الإضاءة، الطابع السينمائي، دارك فانتسي."\n' +
      '}';

    const cleanApiKey = systemSettings.geminiApiKey.trim();
    
    // Fallback logic
    async function attemptFetch(modelName: string) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanApiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }]
        })
      });
      const data = await res.json();
      return { res, data };
    }

    let { res: geminiRes, data: geminiData } = await attemptFetch('gemini-1.5-flash-latest');

    // If high demand, wait a moment and retry with the same model
    if (!geminiRes.ok) {
      const errMsg = geminiData.error?.message?.toLowerCase() || '';
      if (errMsg.includes('high demand') || errMsg.includes('503')) {
        console.log('High demand encountered. Waiting 2 seconds before retrying...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const retryResult = await attemptFetch('gemini-1.5-flash-latest');
        geminiRes = retryResult.res;
        geminiData = retryResult.data;
      } else if (errMsg.includes('not found') || errMsg.includes('not supported')) {
         // If latest is somehow not found, try the specific 001 version
         console.log('Model not found, falling back to gemini-1.5-flash-001...');
         const fallbackResult = await attemptFetch('gemini-1.5-flash-001');
         geminiRes = fallbackResult.res;
         geminiData = fallbackResult.data;
      }
    }
    
    if (!geminiRes.ok) {
      console.error('Gemini API Error details:', geminiData);
      throw new Error(geminiData.error?.message || 'فشل الاتصال بـ Gemini API');
    }

    if (!geminiData.candidates || geminiData.candidates.length === 0) {
      console.error('Gemini returned no candidates. Full response:', geminiData);
      throw new Error('لم يقم الذكاء الاصطناعي بتوليد أي محتوى. قد يكون ذلك بسبب سياسات الأمان أو مشكلة في الخوادم.');
    }

    const text = geminiData.candidates[0].content?.parts?.[0]?.text || '';
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
