import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const videos = await prisma.videoMedia.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الفيديوهات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, videoUrl, thumbnail, isHosted } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'العنوان ورابط الفيديو مطلوبان' },
        { status: 400 }
      );
    }

    const video = await prisma.videoMedia.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        thumbnail: thumbnail || null,
        isHosted: isHosted || false,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في إنشاء الفيديو' }, { status: 500 });
  }
}
