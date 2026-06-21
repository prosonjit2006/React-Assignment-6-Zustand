import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  const isAdminPage = pathname.startsWith("/admin");

  const isSingleBlogPage =
    pathname.startsWith("/blog/") && pathname.split("/").length === 3;

  /*
    login and signup pages
  */

  if (isLoginPage || isSignupPage) {
    if (token) {
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

 /* admin pages  */

  if (isAdminPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  /* single blog pages */

  if (isSingleBlogPage) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/admin/:path*", "/blog/:path*"],
};
