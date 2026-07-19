import { getDatabase } from "@netlify/database";
import { unstable_noStore as noStore } from "next/cache";

export type Series = {
  id: number;
  slug: string;
  name_ua: string;
  name_ru: string;
  cover_image: string | null;
  sort_order: number;
};

export type Product = {
  id: number;
  series_id: number;
  name_ua: string;
  name_ru: string;
  desc_ua: string;
  desc_ru: string;
  price: string;
  old_price: string | null;
  image_url: string | null;
  in_stock: boolean;
  sort_order: number;
};

export type SeriesWithProducts = Series & { products: Product[] };

function db() {
  return getDatabase();
}

// ---------- Settings ----------
export async function getSetting(key: string): Promise<string | null> {
  noStore();
  const rows = await db().sql`SELECT value FROM settings WHERE key = ${key}`;
  return rows[0]?.value ?? null;
}

export async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db().sql`SELECT key, value FROM settings`;
  noStore();
  const out: Record<string, string> = {};
  for (const r of rows as any[]) out[r.key] = r.value;
  return out;
}

export async function setSetting(key: string, value: string) {
  await db().sql`
    INSERT INTO settings (key, value) VALUES (${key}, ${value})
    ON CONFLICT (key) DO UPDATE SET value = ${value}
  `;
}

// ---------- Catalog (public) ----------
export async function listSeriesWithProducts(): Promise<SeriesWithProducts[]> {
  noStore();
  const seriesRows = (await db().sql`
    SELECT * FROM series ORDER BY sort_order ASC, id ASC
  `) as Series[];
  const productRows = (await db().sql`
    SELECT * FROM products ORDER BY sort_order ASC, id ASC
  `) as Product[];
  return seriesRows.map((s) => ({
    ...s,
    products: productRows.filter((p) => p.series_id === s.id),
  }));
}

export async function getSeriesBySlug(slug: string): Promise<SeriesWithProducts | null> {
  noStore();
  const rows = (await db().sql`SELECT * FROM series WHERE slug = ${slug}`) as Series[];
  const s = rows[0];
  if (!s) return null;
  const products = (await db().sql`
    SELECT * FROM products WHERE series_id = ${s.id} ORDER BY sort_order ASC, id ASC
  `) as Product[];
  return { ...s, products };
}

// ---------- Admin: series ----------
export async function createSeries(data: { slug: string; name_ua: string; name_ru: string; cover_image?: string | null; sort_order?: number }) {
  const rows = await db().sql`
    INSERT INTO series (slug, name_ua, name_ru, cover_image, sort_order)
    VALUES (${data.slug}, ${data.name_ua}, ${data.name_ru}, ${data.cover_image ?? null}, ${data.sort_order ?? 0})
    RETURNING *
  `;
  return rows[0];
}

export async function updateSeries(id: number, data: Partial<{ slug: string; name_ua: string; name_ru: string; cover_image: string | null; sort_order: number }>) {
  const current = (await db().sql`SELECT * FROM series WHERE id = ${id}`)[0] as Series | undefined;
  if (!current) throw new Error("Series not found");
  const merged = { ...current, ...data };
  await db().sql`
    UPDATE series SET slug = ${merged.slug}, name_ua = ${merged.name_ua}, name_ru = ${merged.name_ru},
      cover_image = ${merged.cover_image}, sort_order = ${merged.sort_order}
    WHERE id = ${id}
  `;
}

export async function deleteSeries(id: number) {
  await db().sql`DELETE FROM series WHERE id = ${id}`;
}

// ---------- Admin: products ----------
export async function createProduct(data: {
  series_id: number; name_ua: string; name_ru: string; desc_ua?: string; desc_ru?: string;
  price: number; old_price?: number | null; image_url?: string | null; in_stock?: boolean; sort_order?: number;
}) {
  const rows = await db().sql`
    INSERT INTO products (series_id, name_ua, name_ru, desc_ua, desc_ru, price, old_price, image_url, in_stock, sort_order)
    VALUES (${data.series_id}, ${data.name_ua}, ${data.name_ru}, ${data.desc_ua ?? ""}, ${data.desc_ru ?? ""},
      ${data.price}, ${data.old_price ?? null}, ${data.image_url ?? null}, ${data.in_stock ?? true}, ${data.sort_order ?? 0})
    RETURNING *
  `;
  return rows[0];
}

export async function updateProduct(id: number, data: Partial<{
  series_id: number; name_ua: string; name_ru: string; desc_ua: string; desc_ru: string;
  price: number; old_price: number | null; image_url: string | null; in_stock: boolean; sort_order: number;
}>) {
  const current = (await db().sql`SELECT * FROM products WHERE id = ${id}`)[0] as Product | undefined;
  if (!current) throw new Error("Product not found");
  const merged = { ...current, ...data } as any;
  await db().sql`
    UPDATE products SET series_id = ${merged.series_id}, name_ua = ${merged.name_ua}, name_ru = ${merged.name_ru},
      desc_ua = ${merged.desc_ua}, desc_ru = ${merged.desc_ru}, price = ${merged.price}, old_price = ${merged.old_price},
      image_url = ${merged.image_url}, in_stock = ${merged.in_stock}, sort_order = ${merged.sort_order}
    WHERE id = ${id}
  `;
}

export async function deleteProduct(id: number) {
  await db().sql`DELETE FROM products WHERE id = ${id}`;
}

export async function setProductStock(id: number, in_stock: boolean) {
  await db().sql`UPDATE products SET in_stock = ${in_stock} WHERE id = ${id}`;
}
