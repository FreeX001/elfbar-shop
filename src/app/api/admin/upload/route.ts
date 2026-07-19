import { NextRequest, NextResponse } from "next/server";
import { imagesStore } from "@/lib/blobs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const key = `${crypto.randomUUID()}.${ext}`;

  const store = imagesStore();
  await store.set(key, buffer, { metadata: { contentType: file.type || "image/jpeg" } });

  return NextResponse.json({ url: `/api/image/${key}` });
}
