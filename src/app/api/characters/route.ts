import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const characters = await prisma.character.findMany({
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
