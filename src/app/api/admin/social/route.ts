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
  const chapterId = searchParams.get('chapterId');
  const platform = searchParams.get('platform');

  if (!chapterId || !platform) {
    return NextResponse.json({ error: 'معلمات ناقصة' }, { status: 400 });
  }

  try {
    const setting = await prisma.socialPublishSetting.findUnique({
      where: {
        chapterId_platform: {
          chapterId,
          platform
        }
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
    const { chapterId, platform, title, description, hashtags, thumbnailPrompt } = body;

    if (!chapterId || !platform || !title || !description || !hashtags || !thumbnailPrompt) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    const setting = await prisma.socialPublishSetting.upsert({
      where: {
        chapterId_platform: {
          chapterId,
          platform
        }
      },
      update: {
        title,
        description,
        hashtags,
        thumbnailPrompt,
      },
      create: {
        chapterId,
        platform,
        title,
        description,
        hashtags,
        thumbnailPrompt,
      }
    });

    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error('Save Social Setting Error:', error);
    return NextResponse.json({ error: 'فشل في حفظ الإعدادات' }, { status: 500 });
  }
}
