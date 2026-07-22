import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // A simple query that executes on the database to prevent it from sleeping.
    // It's extremely lightweight.
    await prisma.siteTheme.findUnique({
      where: { id: "default" },
      select: { id: true }
    });

    return NextResponse.json(
      { status: 'ok', message: 'Database ping successful.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Failed to ping database.' },
      { status: 500 }
    );
  }
}
