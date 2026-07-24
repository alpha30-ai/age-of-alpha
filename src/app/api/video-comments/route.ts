import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    const comments = await prisma.videoComment.findMany({
      where: { videoId },
      include: {
        user: {
          select: { name: true, image: true, role: true, isBanned: true, rank: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Don't return comments from banned users
    const filteredComments = comments.filter(c => !c.user.isBanned);

    return NextResponse.json(filteredComments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check if user is banned
    const user = await prisma.user.findUnique({ where: { email: session.user.email as string } });
    if (!user || user.isBanned) {
      return NextResponse.json({ error: 'User is banned' }, { status: 403 });
    }

    const body = await request.json();
    const { content, videoId } = body;

    if (!content || !videoId) {
      return NextResponse.json({ error: 'Content and videoId are required' }, { status: 400 });
    }

    const comment = await prisma.videoComment.create({
      data: {
        content,
        videoId,
        userId: user.id
      },
      include: {
        user: {
          select: { name: true, image: true, role: true, rank: true }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { commentId, action } = body;

    if (action === 'report') {
      const updatedComment = await prisma.videoComment.update({
        where: { id: commentId },
        data: { isReported: true }
      });
      return NextResponse.json(updatedComment);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}
