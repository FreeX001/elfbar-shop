"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import ProductRow from "./ProductRow";
import AddProductForm from "./AddProductForm";
import type { SeriesWithProducts } from "@/lib/db";

export default function SeriesBlock({
  series,
  onRefresh,
}: {
  series: SeriesWithProducts;
  onRefresh: () => void;
}) {
  const [form, setForm] = useState(series);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/series/${series.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: form.slug,
        name_ua: form.name_ua,
        name_ru: form.name_ru,
        cover_image: form.cover_image,
      }),
    });
    setSaving(false);
    onRefresh();
  };

  const del = async () => {
    if (!confirm("Видалити всю лінійку разом зі смаками?")) return;
    await fetch(`/api/admin/series/${series.id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="neon-border bg-panel rounded-2xl p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <ImageUploader value={form.cover_image} onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))} />
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <input
            className="bg-transparent border-b border-white/15 font-semibold px-1 py-1 outline-none focus:border-neon-purple"
            value={form.name_ua}
            onChange={(e) => setForm((f) => ({ ...f, name_ua: e.target.value }))}
            placeholder="Назва лінійки UA"
          />
          <input
            className="bg-transparent border-b border-white/15 px-1 py-1 outline-none focus:border-neon-purple text-sm text-white/70"
            value={form.name_ru}
            onChange={(e) => setForm((f) => ({ ...f, name_ru: e.target.value }))}
            placeholder="Назва лінійки RU"
          />
          <input
            className="bg-transparent border-b border-white/10 px-1 py-1 outline-none focus:border-neon-cyan text-xs text-white/40"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="slug-url"
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="text-xs px-4 py-2 rounded-full bg-neon-purple/80 hover:bg-neon-purple font-semibold"
        >
          {saving ? "..." : "Зберегти лінійку"}
        </button>
        <button onClick={del} className="text-xs px-4 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30">
          Видалити лінійку
        </button>
      </div>

      <div className="space-y-2 pl-2 border-l-2 border-white/10">
        {form.products.map((p) => (
          <ProductRow key={p.id} product={p} onSaved={onRefresh} onDeleted={onRefresh} />
        ))}
        <AddProductForm seriesId={series.id} onAdded={onRefresh} />
      </div>
    </div>
  );
}
