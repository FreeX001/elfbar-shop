import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${crypto.randomUUID()}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type || "image/jpeg",
  });

  return NextResponse.json({ url: blob.url });
}
