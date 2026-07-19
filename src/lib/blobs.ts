import { getStore } from "@netlify/blobs";

export function imagesStore() {
  return getStore("product-images");
}
