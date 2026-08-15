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
      return NextResponse.json({ error: 'تنسيق الملف غير صالح، يجب أن يكون مصفوفة من الفصول' }, { status: 400 });
    }

    let importedCount = 0;

    for (const chapter of data) {
      // Validate required fields
      if (!chapter.title || !chapter.content) continue;

      // Extract raw data and avoid ID conflicts
      const { id, createdAt, updatedAt, ...chapterData } = chapter;

      // Make sure we have a chapterNum
      const chapterNum = chapterData.chapterNum || (await prisma.chapter.count()) + 1;

      await prisma.chapter.create({
        data: {
          ...chapterData,
          chapterNum,
        }
      });
      importedCount++;
    }

    return NextResponse.json({ success: true, count: importedCount });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء استيراد الفصول' }, { status: 500 });
  }
}
