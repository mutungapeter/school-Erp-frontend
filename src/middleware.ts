import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import cookie from 'cookie';
import { parse } from 'cookie';

  
export function middleware(request: NextRequest) {
  
  const cookies = parse(request.headers.get('Cookie') || '');
  const token = cookies?.accessToken;

 
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

  return NextResponse.next();
};
export const config = {
  matcher: [
    "/dashboard/:path*",
     "/students/:path*",
     "/teachers/:path*",
     "/classes/:path*",
     "/subjects/:path*",
     "/settings/:path*",
     "/accounts/:path*",
     "/form-levels/:path*",
     "/grading/:path*",
     "/grading/meangradeconfigs/:path*",
     "/marks/:path*",
     "/marks/list/:path*",
     "/promotions/:path*",
     "/reports/reportcard/:path*",
     "/settings/:path*",
     "/profile/:path*",
     "/change-password/:path*",
     "/alumni/:path*"
    ],
};