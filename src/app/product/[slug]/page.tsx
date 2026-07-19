import { notFound } from "next/navigation";
import { getSeriesBySlug } from "@/lib/db";
import ProductView from "@/components/ProductView";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const series = await getSeriesBySlug(params.slug);
  if (!series || series.products.length === 0) notFound();

  return <ProductView series={series} />;
}
