"use client";

import { useMemo, useState } from "react";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";
import type { SeriesWithProducts } from "@/lib/db";

export default function ProductView({ series }: { series: SeriesWithProducts }) {
  const { lang, t } = useLang();
  const { addItem, openCart } = useCart();

  const products = series.products;
  const firstInStock = products.find((p) => p.in_stock) ?? products[0];
  const [selectedId, setSelectedId] = useState(firstInStock.id);
  const [qty, setQty] = useState(1);

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) ?? products[0],
    [products, selectedId]
  );

  const seriesName = lang === "ua" ? series.name_ua : series.name_ru;
  const flavorName = lang === "ua" ? selected.name_ua : selected.name_ru;
  const desc = lang === "ua" ? selected.desc_ua : selected.desc_ru;

  const handleAdd = () => {
    if (!selected.in_stock) return;
    addItem(
      {
        productId: selected.id,
        seriesName,
        flavorName,
        price: Number(selected.price),
        image: selected.image_url,
      },
      qty
    );
  };

  return (
    <div className="mt-8 grid md:grid-cols-2 gap-8">
      <div className="flex gap-3">
        <div className="flex flex-col gap-2 order-2 md:order-1 overflow-y-auto max-h-[520px] scrollbar-thin pr-1">
          {products.map((p) => {
            const name = lang === "ua" ? p.name_ua : p.name_ru;
            const active = p.id === selected.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                title={name}
                className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border transition ${
                  active
                    ? "border-neon-pink shadow-neon"
                    : "border-white/15 hover:border-neon-cyan"
                } ${!p.in_stock ? "badge-out" : ""}`}
              >
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-panel2 flex items-center justify-center text-[9px] text-white/30">
                    {name.slice(0, 6)}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className={`relative flex-1 order-1 md:order-2 rounded-3xl overflow-hidden neon-border bg-panel aspect-square ${!selected.in_stock ? "badge-out" : ""}`}>
          {selected.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.image_url} alt={flavorName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">no photo</div>
          )}
          <span
            className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full font-semibold ${
              selected.in_stock ? "bg-neon-green/20 text-neon-green" : "bg-black/60 text-white/60"
            }`}
          >
            {selected.in_stock ? t.inStock : t.outOfStock}
          </span>
        </div>
      </div>

      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black neon-text">{seriesName}</h1>
        <p className="mt-1 text-neon-cyan font-semibold">{t.flavor}: {flavorName}</p>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-bold">{Number(selected.price)} ₴</span>
          {selected.old_price && (
            <span className="text-white/40 line-through">{Number(selected.old_price)} ₴</span>
          )}
        </div>

        {desc && <p className="mt-4 text-white/60 text-sm leading-relaxed">{desc}</p>}

        <div className="mt-6">
          <p className="text-sm text-white/50 mb-2">{t.chooseFlavor}</p>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => {
              const name = lang === "ua" ? p.name_ua : p.name_ru;
              const active = p.id === selected.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${
                    active
                      ? "bg-neon-purple border-neon-purple text-white"
                      : "border-white/20 text-white/70 hover:border-neon-cyan"
                  } ${!p.in_stock ? "opacity-40" : ""}`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <p className="text-sm text-white/50">{t.quantity}</p>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="w-6 text-center">{qty}</span>
            <button
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setQty((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            disabled={!selected.in_stock}
            onClick={handleAdd}
            className="flex-1 py-3 rounded-full font-bold bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-neon transition disabled:opacity-30 disabled:pointer-events-none"
          >
            {t.buy}
          </button>
          <button
            disabled={!selected.in_stock}
            onClick={() => {
              handleAdd();
              openCart();
            }}
            className="px-5 py-3 rounded-full font-semibold neon-border hover:shadow-neonCyan transition disabled:opacity-30 disabled:pointer-events-none"
          >
            {t.cart}
          </button>
        </div>
      </div>
    </div>
  );
}
