import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is an admin route
  if (pathname.startsWith("/admin") || pathname.match(/^\/[a-z]{2}\/admin/)) {
    // Get the session token from cookies
    const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
                        request.cookies.get("__Secure-next-auth.session-token")?.value;
    
    if (!sessionToken) {
      // Redirect to login if no session
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    
    // Add admin-specific headers
    const response = NextResponse.next();
    response.headers.set("x-admin-route", "true");
    response.headers.set("x-admin-isolation", "active");
    
    return response;
  }
  
  return NextResponse.next();
}