import { NextResponse } from "next/server";
import { listSeriesWithProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const series = await listSeriesWithProducts();
  return NextResponse.json({ series });
}
