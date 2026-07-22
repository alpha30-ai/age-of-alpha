import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const chapter = await prisma.chapter.findUnique({ where: { id } });
    if (!chapter) {
      return NextResponse.json({ error: 'الفصل غير موجود' }, { status: 404 });
    }
    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الفصل' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { chapterNum, title, content, audioUrl } = body;

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        ...(chapterNum && { chapterNum: parseInt(chapterNum) }),
        ...(title && { title }),
        ...(content && { content }),
        audioUrl: audioUrl || null,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في تحديث الفصل' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.chapter.delete({ where: { id } });
    return NextResponse.json({ message: 'تم حذف الفصل بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف الفصل' }, { status: 500 });
  }
}
