import { NextRequest, NextResponse } from "next/server";
import { listSeriesWithProducts, createSeries } from "@/lib/db";

export async function GET() {
  const series = await listSeriesWithProducts();
  return NextResponse.json({ series });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createSeries(body);
  return NextResponse.json({ series: created });
}
