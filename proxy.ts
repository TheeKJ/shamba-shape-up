import { NextRequest, NextResponse } from 'next/server';

const roleHome: Record<string, string> = {
  investor: '/investor',
  farmer: '/farmer',
  worker: '/worker',
  admin: '/admin',
};

const publicPaths = new Set(['/login', '/register']);

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicAsset(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('shamba_access_token')?.value;
  const role = request.cookies.get('shamba_user_role')?.value;
  const targetPath = role ? roleHome[role] : undefined;

  if (!accessToken) {
    if (publicPaths.has(pathname)) {
      return NextResponse.next();
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (publicPaths.has(pathname) && targetPath) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  if ((pathname === '/' || pathname === '/switch') && targetPath) {
    return NextResponse.redirect(new URL(targetPath, request.url));
  }

  const routeRole = pathname.split('/')[1];

  if (role && roleHome[routeRole] && routeRole !== role) {
    return NextResponse.redirect(new URL(targetPath || '/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
