import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminLoginApi = pathname === "/api/admin/login";

  if (pathname.startsWith("/admin") && !isLoginPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const ok = await isValidSessionToken(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  if (isAdminApi && !isAdminLoginApi) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const ok = await isValidSessionToken(token);
    if (!ok) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
