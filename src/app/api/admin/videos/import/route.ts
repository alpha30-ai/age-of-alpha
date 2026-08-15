import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح لك بالدخول' }, { status: 401 });
    }

    const data = await request.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'تنسيق الملف غير صالح، يجب أن يكون مصفوفة من الفيديوهات' }, { status: 400 });
    }

    let importedCount = 0;

    for (const video of data) {
      // Validate required fields
      if (!video.title || !video.url) continue;

      // Extract raw data and avoid ID conflicts
      const { id, createdAt, updatedAt, ...videoData } = video;

      await prisma.videoMedia.create({
        data: {
          ...videoData,
        }
      });
      importedCount++;
    }

    return NextResponse.json({ success: true, count: importedCount });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء استيراد الفيديوهات' }, { status: 500 });
  }
}
