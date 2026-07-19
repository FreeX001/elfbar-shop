"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import type { SeriesWithProducts } from "@/lib/db";

export default function SeriesCard({ series }: { series: SeriesWithProducts }) {
  const { lang, t } = useLang();
  const name = lang === "ua" ? series.name_ua : series.name_ru;
  const anyInStock = series.products.some((p) => p.in_stock);
  const prices = series.products.map((p) => Number(p.price)).filter((n) => !Number.isNaN(n));
  const minPrice = prices.length ? Math.min(...prices) : null;
  const cover = series.cover_image || series.products[0]?.image_url;

  return (
    <Link
      href={`/product/${series.slug}`}
      className="card-glow group rounded-2xl overflow-hidden neon-border bg-panel flex flex-col"
    >
      <div className={`aspect-square relative overflow-hidden bg-panel2 ${!anyInStock ? "badge-out" : ""}`}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">no photo</div>
        )}
        {!anyInStock && (
          <span className="absolute top-2 right-2 bg-black/70 text-[10px] px-2 py-1 rounded-full text-white/70">
            {t.outOfStock}
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="font-semibold text-sm leading-snug line-clamp-2">{name}</p>
        <div className="mt-auto pt-2 flex items-center justify-between">
          {minPrice !== null && <span className="text-neon-cyan font-bold text-sm">від {minPrice} ₴</span>}
          <span className="text-xs text-white/40">{series.products.length} {t.flavor.toLowerCase()}</span>
        </div>
      </div>
    </Link>
  );
}
