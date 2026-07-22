import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId, action, value } = await request.json();

    if (action === 'role') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: value }
      });
      return NextResponse.json(user);
    }

    if (action === 'ban') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { isBanned: value }
      });
      return NextResponse.json(user);
    }
    
    if (action === 'rank') {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { rank: value }
      });
      return NextResponse.json(user);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
