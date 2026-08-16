import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');

    if (!novelId) {
      return NextResponse.json({ error: 'Missing novelId parameter' }, { status: 400 });
    }

    const posts = await prisma.communityPost.findMany({
      where: { novelId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, image: true, role: true, rank: true }
        }
      }
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch community posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, imageUrl, novelId } = body;

    if (!content || !novelId) {
      return NextResponse.json({ error: 'Content and novelId are required' }, { status: 400 });
    }

    // Get user id
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.communityPost.create({
      data: {
        content,
        imageUrl,
        novelId,
        userId: user.id
      },
      include: {
        user: {
          select: { name: true, image: true, role: true, rank: true }
        }
      }
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to create community post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Only admin or post owner can delete
    if (user.role !== 'ADMIN' && post.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.communityPost.delete({ where: { id: postId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete community post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
