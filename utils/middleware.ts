import { AuthRoutes } from "@/constants/enums";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const authRoutes: AuthRoutes[] = [ 
  AuthRoutes.LOGIN,
  AuthRoutes.FORGOT_PASSWORD,
  AuthRoutes.OVERVIEW,
  AuthRoutes.PERSONAL,
  AuthRoutes.PERSONAL_INFO
];

const validRoutes: AuthRoutes[] = [...authRoutes, AuthRoutes.ROOT];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (!validRoutes.includes(pathname as AuthRoutes) && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
