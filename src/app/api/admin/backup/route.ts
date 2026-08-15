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
    const systemSettings = await prisma.systemSettings.findUnique({ where: { id: 'default' } });
    const chapters = await prisma.chapter.findMany({
      include: {
        socialSettings: true,
      }
    });
    const characters = await prisma.character.findMany({
      include: {
        socialSettings: true,
      }
    });
    const videos = await prisma.videoMedia.findMany({
      include: {
        socialSettings: true,
      }
    });

    const backupData = {
      version: '1.1',
      timestamp: new Date().toISOString(),
      data: {
        siteTheme,
        systemSettings,
        chapters,
        characters,
        videos,
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

    const { siteTheme, systemSettings, chapters, characters, videos } = backupData.data;

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

    // Restore SystemSettings
    if (systemSettings) {
      await prisma.systemSettings.upsert({
        where: { id: 'default' },
        update: systemSettings,
        create: {
          ...systemSettings,
          id: 'default',
        }
      });
    }

    // Restore Chapters
    if (chapters && Array.isArray(chapters)) {
      for (const chapter of chapters) {
        const { socialSettings, comments, id, ...chapterData } = chapter;
        await prisma.chapter.upsert({
          where: { chapterNum: chapter.chapterNum },
          update: chapterData,
          create: {
            ...chapterData,
            id,
          }
        });
        if (socialSettings && Array.isArray(socialSettings)) {
          for (const setting of socialSettings) {
            const { id: settingId, ...settingData } = setting;
            await prisma.socialPublishSetting.upsert({
              where: {
                targetType_chapterId_characterId_videoId_platform: {
                  targetType: settingData.targetType,
                  chapterId: settingData.chapterId,
                  characterId: settingData.characterId,
                  videoId: settingData.videoId,
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
        const { socialSettings, id, ...charData } = char;
        await prisma.character.upsert({
          where: { id },
          update: charData,
          create: {
            ...charData,
            id,
          }
        });
        if (socialSettings && Array.isArray(socialSettings)) {
          for (const setting of socialSettings) {
            const { id: settingId, ...settingData } = setting;
            await prisma.socialPublishSetting.upsert({
              where: {
                targetType_chapterId_characterId_videoId_platform: {
                  targetType: settingData.targetType,
                  chapterId: settingData.chapterId,
                  characterId: settingData.characterId,
                  videoId: settingData.videoId,
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
    
    // Restore Videos
    if (videos && Array.isArray(videos)) {
      for (const vid of videos) {
        const { socialSettings, comments, id, ...vidData } = vid;
        await prisma.videoMedia.upsert({
          where: { id },
          update: vidData,
          create: {
            ...vidData,
            id,
          }
        });
        if (socialSettings && Array.isArray(socialSettings)) {
          for (const setting of socialSettings) {
            const { id: settingId, ...settingData } = setting;
            await prisma.socialPublishSetting.upsert({
              where: {
                targetType_chapterId_characterId_videoId_platform: {
                  targetType: settingData.targetType,
                  chapterId: settingData.chapterId,
                  characterId: settingData.characterId,
                  videoId: settingData.videoId,
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

    return NextResponse.json({ success: true, message: 'تم استعادة النسخة الاحتياطية بنجاح' });
  } catch (error) {
    console.error('Backup Import Error:', error);
    return NextResponse.json({ error: 'فشل في استعادة النسخة الاحتياطية' }, { status: 500 });
  }
}
