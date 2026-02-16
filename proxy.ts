import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
  // Protected routes
  const protectedPaths = ['/dashboard', '/profile'];
  const isProtectedPath = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // ✅ Only read token from cookies (server-side)
  const token = req.cookies.get('todo_app_token')?.value;

  // Redirect if accessing protected route without token
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Allow access
  return NextResponse.next();
}

// Optional: matcher if needed
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
