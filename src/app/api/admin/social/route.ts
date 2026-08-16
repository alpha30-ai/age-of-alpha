import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get('targetType');
  const targetId = searchParams.get('targetId');
  const platform = searchParams.get('platform');

  if (!targetType || !targetId || !platform) {
    return NextResponse.json({ error: 'معلمات ناقصة' }, { status: 400 });
  }

  try {
    const setting = await prisma.socialPublishSetting.findFirst({
      where: {
        targetType,
        platform,
        OR: [
          { chapterId: targetId },
          { characterId: targetId },
          { videoId: targetId },
        ]
      }
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الإعدادات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { targetType, targetId, platform, title, description, hashtags, youtubeTags, thumbnailPrompt } = body;

    if (!targetType || !targetId || !platform || !title || !description || !hashtags || !thumbnailPrompt) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    // Since Prisma @@unique requires the exact object, we use findFirst and then update/create
    const existing = await prisma.socialPublishSetting.findFirst({
      where: {
        targetType,
        platform,
        OR: [
          { chapterId: targetId },
          { characterId: targetId },
          { videoId: targetId },
        ]
      }
    });

    const dataPayload = {
      targetType,
      platform,
      title,
      description,
      hashtags,
      youtubeTags,
      thumbnailPrompt,
      chapterId: targetType === 'CHAPTER' ? targetId : null,
      characterId: targetType === 'CHARACTER' ? targetId : null,
      videoId: targetType === 'VIDEO' ? targetId : null,
    };

    let setting;
    if (existing) {
      setting = await prisma.socialPublishSetting.update({
        where: { id: existing.id },
        data: dataPayload,
      });
    } else {
      setting = await prisma.socialPublishSetting.create({
        data: dataPayload,
      });
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error('Save Social Setting Error:', error);
    return NextResponse.json({ error: 'فشل في حفظ الإعدادات' }, { status: 500 });
  }
}
