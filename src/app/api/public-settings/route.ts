import { NextResponse } from "next/server";
import { getSetting } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const telegram_username = (await getSetting("telegram_username")) || "";
  return NextResponse.json({ telegram_username });
}
