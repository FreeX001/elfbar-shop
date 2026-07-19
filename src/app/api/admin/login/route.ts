import { NextRequest, NextResponse } from "next/server";
import { getSetting } from "@/lib/db";
import { createSessionToken, COOKIE_NAME, MAX_AGE_MS } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const stored = (await getSetting("admin_password")) || process.env.ADMIN_PASSWORD || "";

  if (!password || password !== stored) {
    return NextResponse.json({ error: "invalid_password" }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  });
  return res;
}
