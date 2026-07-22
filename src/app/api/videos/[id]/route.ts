import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.videoMedia.delete({ where: { id } });
    return NextResponse.json({ message: 'تم حذف الفيديو بنجاح' });
  } catch (error) {
    return NextResponse.json({ error: 'فشل في حذف الفيديو' }, { status: 500 });
  }
}
