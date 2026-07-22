import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        chapter: { select: { chapterNum: true, title: true } }
      },
      orderBy: [
        { isReported: 'desc' }, // Reported comments first
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { commentId, action } = await request.json();

    if (action === 'dismiss_report') {
      const comment = await prisma.comment.update({
        where: { id: commentId },
        data: { isReported: false }
      });
      return NextResponse.json(comment);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ error: 'Comment ID is required' }, { status: 400 });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
