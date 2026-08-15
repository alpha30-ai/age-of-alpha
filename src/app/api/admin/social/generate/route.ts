import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const systemSettings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    const apiKey = systemSettings?.openAiApiKey || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'لم يتم العثور على مفتاح OpenAI. يرجى إضافته من صفحة إعدادات النظام أولاً.' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { targetType, targetId, platform } = body;

    if (!targetType || !targetId || !platform) {
      return NextResponse.json({ error: 'بيانات ناقصة (نوع المحتوى أو المعرف)' }, { status: 400 });
    }

    let contentName = '';
    let contentDetails = '';
    let typeName = '';

    if (targetType === 'CHAPTER') {
      const chapter = await prisma.chapter.findUnique({ where: { id: targetId } });
      if (!chapter) return NextResponse.json({ error: 'الفصل غير موجود' }, { status: 404 });
      typeName = 'فصل من الرواية';
      contentName = `الفصل ${chapter.chapterNum}: ${chapter.title}`;
      contentDetails = chapter.content.substring(0, 1500);
    } else if (targetType === 'CHARACTER') {
      const character = await prisma.character.findUnique({ where: { id: targetId } });
      if (!character) return NextResponse.json({ error: 'الشخصية غير موجودة' }, { status: 404 });
      typeName = 'شخصية من الرواية';
      contentName = `الشخصية: ${character.name} (${character.title || ''})`;
      contentDetails = `الفصيل: ${character.faction}\nالوصف:\n${character.description}`;
    } else if (targetType === 'VIDEO') {
      const video = await prisma.videoMedia.findUnique({ where: { id: targetId } });
      if (!video) return NextResponse.json({ error: 'الفيديو غير موجود' }, { status: 404 });
      typeName = 'فيديو دعائي / ملخص';
      contentName = `الفيديو: ${video.title}`;
      contentDetails = `الوصف الحالي للفيديو:\n${video.description || 'لا يوجد وصف.'}`;
    } else {
      return NextResponse.json({ error: 'نوع المحتوى غير مدعوم' }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const promptText = `
أنت خبير تسويق رقمي وصانع محتوى محترف.
لدينا منصة ملحمية من فئة الدارك فانتسي (Dark Fantasy) تسمى "عهد ألفا".
أحتاج منك إنشاء تفاصيل النشر لمنصة ${platform === 'YOUTUBE' ? 'يوتيوب (فيديو طويل أو شورت)' : 'فيسبوك (منشور جذاب)'} لهذا العنصر (${typeName}):

الاسم/العنوان: ${contentName}
التفاصيل/المحتوى:
${contentDetails}

المطلوب إرجاعه بصيغة JSON فقط بالهيكل التالي (بدون أي نصوص إضافية):
{
  "title": "عنوان جذاب جداً ومثير للفضول يناسب المنصة، باللغة العربية",
  "description": "وصف مشوق للفيديو/المنشور باللغة العربية، بأسلوب غامض وملحمي.",
  "hashtags": "مجموعة من الهاشتاجات العربية والإنجليزية المناسبة، مفصولة بمسافات",
  "thumbnailPrompt": "برومبت باللغة الإنجليزية مخصص لـ Midjourney لتوليد صورة مصغرة (Thumbnail). يجب أن يكون الوصف دقيقاً، سينمائياً، واقعي بنمط الأنمي (Anime Realism, Dark Fantasy, Epic Lighting)، ويصف المشهد أو الشخصية بدقة."
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: promptText }],
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) throw new Error('فشل توليد النص من الذكاء الاصطناعي');

    const result = JSON.parse(responseContent);

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: ' + error.message }, { status: 500 });
  }
}
