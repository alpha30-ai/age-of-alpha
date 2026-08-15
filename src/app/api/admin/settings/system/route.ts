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
    const settings = await prisma.systemSettings.findUnique({
      where: { id: 'default' }
    });

    return NextResponse.json({ success: true, data: settings || {} });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب إعدادات النظام' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { openAiApiKey, cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = body;

    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: {
        openAiApiKey,
        cloudinaryCloudName,
        cloudinaryApiKey,
        cloudinaryApiSecret,
      },
      create: {
        id: 'default',
        openAiApiKey,
        cloudinaryCloudName,
        cloudinaryApiKey,
        cloudinaryApiSecret,
      }
    });

    return NextResponse.json({ success: true, message: 'تم حفظ الإعدادات بنجاح', data: settings });
  } catch (error) {
    console.error('System Settings Save Error:', error);
    return NextResponse.json({ error: 'فشل في حفظ إعدادات النظام' }, { status: 500 });
  }
}
