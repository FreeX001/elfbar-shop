import { NextRequest, NextResponse } from "next/server";
import { imagesStore } from "@/lib/blobs";

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  const store = imagesStore();
  const result = await store.getWithMetadata(params.key, { type: "arrayBuffer" });
  if (!result) {
    return new NextResponse("Not found", { status: 404 });
  }
  const contentType = (result.metadata as any)?.contentType || "application/octet-stream";
  return new NextResponse(result.data as ArrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
