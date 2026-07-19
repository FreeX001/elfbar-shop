import { NextResponse } from "next/server";

// Deprecated: images are now served directly from Vercel Blob's own public URLs,
// so new uploads never hit this route. Kept only so old links don't crash the build.
export async function GET() {
  return new NextResponse("Not found", { status: 404 });
}
