import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const created = await createProduct(body);
  return NextResponse.json({ product: created });
}
