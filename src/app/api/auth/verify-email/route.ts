import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=InvalidToken`);
  }

  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(`${baseUrl}/login?error=InvalidToken`);
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(`${baseUrl}/login?error=InvalidToken`);
    }

    await prisma.user.updateMany({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    console.error('Verify Email Error:', error);
    return NextResponse.redirect(`${baseUrl}/login?error=InternalServerError`);
  }
}
