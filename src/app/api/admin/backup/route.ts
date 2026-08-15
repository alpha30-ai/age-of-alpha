import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const siteTheme = await prisma.siteTheme.findUnique({ where: { id: 'default' } });
    const chapters = await prisma.chapter.findMany({
      include: {
        socialSettings: true,
      }
    });
    const characters = await prisma.character.findMany();

    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        siteTheme,
        chapters,
        characters,
      }
    };

    return NextResponse.json(backupData);
  } catch (error) {
    console.error('Backup Export Error:', error);
    return NextResponse.json({ error: 'فشل في تصدير النسخة الاحتياطية' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const backupData = await request.json();

    if (!backupData || !backupData.data) {
      return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 });
    }

    const { siteTheme, chapters, characters } = backupData.data;

    // Restore SiteTheme
    if (siteTheme) {
      await prisma.siteTheme.upsert({
        where: { id: 'default' },
        update: siteTheme,
        create: {
          ...siteTheme,
          id: 'default',
        }
      });
    }

    // Restore Chapters
    if (chapters && Array.isArray(chapters)) {
      for (const chapter of chapters) {
        // Extract socialSettings so we can handle them separately
        const { socialSettings, comments, id, ...chapterData } = chapter;
        
        await prisma.chapter.upsert({
          where: { chapterNum: chapter.chapterNum },
          update: chapterData,
          create: {
            ...chapterData,
            id,
          }
        });

        // Restore social settings if any
        if (socialSettings && Array.isArray(socialSettings)) {
          for (const setting of socialSettings) {
            const { id: settingId, ...settingData } = setting;
            await prisma.socialPublishSetting.upsert({
              where: {
                chapterId_platform: {
                  chapterId: settingData.chapterId,
                  platform: settingData.platform,
                }
              },
              update: settingData,
              create: {
                ...settingData,
                id: settingId,
              }
            });
          }
        }
      }
    }

    // Restore Characters
    if (characters && Array.isArray(characters)) {
      for (const char of characters) {
        const { id, ...charData } = char;
        await prisma.character.upsert({
          where: { id },
          update: charData,
          create: {
            ...charData,
            id,
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح' });
  } catch (error) {
    console.error('Backup Import Error:', error);
    return NextResponse.json({ error: 'فشل في استعادة النسخة الاحتياطية' }, { status: 500 });
  }
}
