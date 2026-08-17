import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const novelId = searchParams.get('novelId');

    const posts = await prisma.communityPost.findMany({
      where: novelId ? { novelId } : undefined, // If novelId is not provided, fetch all posts
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, image: true, role: true, rank: true }
        },
        novel: {
          select: { title: true }
        },
        likes: true,
        _count: {
          select: { comments: true }
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

    // --- Link Validation System ---
    const isValidUrl = (text: string): boolean => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = text.match(urlRegex) || [];
      const allowedDomains = ['youtube.com', 'youtu.be', 'facebook.com', 'x.com', 'twitter.com', 'imgur.com', 'pinterest.com'];
      
      for (const urlStr of urls) {
        try {
          const urlObj = new URL(urlStr);
          const isAllowed = allowedDomains.some(domain => 
            urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
          );
          if (!isAllowed) return false;
        } catch {
          return false;
        }
      }
      return true;
    };

    if (imageUrl && imageUrl.startsWith('http')) {
      if (!isValidUrl(imageUrl)) {
        return NextResponse.json({ error: 'الرابط المرفق غير مدعوم أو غير موثوق. يرجى استخدام مواقع معروفة مثل يوتيوب أو إمجور.' }, { status: 400 });
      }
    }

    if (content) {
      if (!isValidUrl(content)) {
        return NextResponse.json({ error: 'محتوى المنشور يحتوي على روابط خارجية غير مدعومة أو غير موثوقة.' }, { status: 400 });
      }
    }
    // -----------------------------

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
