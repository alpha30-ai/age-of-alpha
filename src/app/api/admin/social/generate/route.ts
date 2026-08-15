import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ 
      error: 'لم يتم العثور على مفتاح OPENAI_API_KEY في إعدادات السيرفر. يرجى إضافته في ملف .env أو Vercel.' 
    }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { chapterId, platform } = body;

    if (!chapterId || !platform) {
      return NextResponse.json({ error: 'بيانات ناقصة' }, { status: 400 });
    }

    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId }
    });

    if (!chapter) {
      return NextResponse.json({ error: 'الفصل غير موجود' }, { status: 404 });
    }

    const openai = new OpenAI({ apiKey });

    const promptText = `
أنت خبير تسويق رقمي وصانع محتوى محترف.
لدينا رواية ملحمية من فئة الدارك فانتسي (Dark Fantasy) تسمى "عهد ألفا".
أحتاج منك إنشاء تفاصيل النشر لمنصة ${platform === 'YOUTUBE' ? 'يوتيوب (فيديو طويل)' : 'فيسبوك (منشور جذاب)'} للفصل التالي:

رقم الفصل: ${chapter.chapterNum}
عنوان الفصل: ${chapter.title}
محتوى الفصل (أو جزء منه لفهم السياق):
${chapter.content.substring(0, 1000)}...

المطلوب إرجاعه بصيغة JSON فقط بالهيكل التالي (بدون أي نصوص إضافية):
{
  "title": "عنوان جذاب جداً ومثير للفضول يناسب المنصة، باللغة العربية",
  "description": "وصف مشوق للفيديو/المنشور باللغة العربية، يحتوي على تلميحات للأحداث بأسلوب غامض وملحمي.",
  "hashtags": "مجموعة من الهاشتاجات العربية والإنجليزية المناسبة، مفصولة بمسافات",
  "thumbnailPrompt": "برومبت باللغة الإنجليزية مخصص لـ Midjourney لتوليد صورة مصغرة (Thumbnail). يجب أن يكون الوصف دقيقاً، سينمائياً، واقعي بنمط الأنمي (Anime Realism, Dark Fantasy, Epic Lighting)، ويصف مشهداً رئيسياً من الفصل."
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for speed and cost efficiency
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
