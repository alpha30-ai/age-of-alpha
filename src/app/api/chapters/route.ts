import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { chapterNum: 'asc' },
    });
    return NextResponse.json(chapters);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الفصول' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapterNum, title, content, audioUrl } = body;

    if (!chapterNum || !title || !content) {
      return NextResponse.json(
        { error: 'رقم الفصل والعنوان والمحتوى مطلوبة' },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.create({
      data: {
        chapterNum: parseInt(chapterNum),
        title,
        content,
        audioUrl: audioUrl || null,
      },
    });

    return NextResponse.json(chapter, { status: 201 });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'رقم الفصل مستخدم بالفعل' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'فشل في إنشاء الفصل' }, { status: 500 });
  }
}
