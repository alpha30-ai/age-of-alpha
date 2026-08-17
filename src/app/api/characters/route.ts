import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');

    const characters = await prisma.character.findMany({
      where: novelId ? { novelId } : undefined,
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(characters);
  } catch (error) {
    return NextResponse.json({ error: 'فشل في جلب الشخصيات' }, { status: 500 });
  }
}
