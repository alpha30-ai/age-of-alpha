import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Rely on Server Components (layout.tsx) for role checking to avoid stale JWT issues
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/admin') || path.startsWith('/dashboard')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
