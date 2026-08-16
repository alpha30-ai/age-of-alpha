import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const novels = await prisma.novel.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chapters: true, characters: true, videos: true }
        }
      }
    });
    return NextResponse.json(novels);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch novels' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, coverImage, author } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const novel = await prisma.novel.create({
      data: {
        title,
        description,
        coverImage,
        author: author || 'مجهول',
      }
    });

    return NextResponse.json(novel);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create novel' }, { status: 500 });
  }
}
