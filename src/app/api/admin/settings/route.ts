import { NextRequest, NextResponse } from "next/server";
import { getAllSettings, setSetting } from "@/lib/db";

export async function GET() {
  const settings = await getAllSettings();
  const { admin_password, session_secret, ...safe } = settings as any;
  return NextResponse.json({ settings: safe, hasPassword: !!admin_password });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (typeof body.telegram_username === "string") {
    await setSetting("telegram_username", body.telegram_username.replace(/^@/, ""));
  }
  if (typeof body.new_password === "string" && body.new_password.length >= 4) {
    await setSetting("admin_password", body.new_password);
  }
  return NextResponse.json({ ok: true });
}
