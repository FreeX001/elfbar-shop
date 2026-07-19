import { NextRequest, NextResponse } from "next/server";
import { updateSeries, deleteSeries } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  await updateSeries(Number(params.id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await deleteSeries(Number(params.id));
  return NextResponse.json({ ok: true });
}
