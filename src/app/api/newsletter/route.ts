import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'أنت مسجل بالفعل في النخبة!' }, { status: 400 });
    }

    await prisma.newsletterSubscriber.create({
      data: { email }
    });

    return NextResponse.json({ success: true, message: 'مرحباً بك في صفوف النخبة.' });
  } catch (error: any) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json({ error: 'فشل في التسجيل، يرجى المحاولة لاحقاً.' }, { status: 500 });
  }
}
