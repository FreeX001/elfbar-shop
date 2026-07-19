"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import type { Product } from "@/lib/db";

export default function ProductRow({
  product,
  onSaved,
  onDeleted,
}: {
  product: Product;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [form, setForm] = useState(product);
  const [saving, setSaving] = useState(false);

  const update = (patch: Partial<Product>) => setForm((f) => ({ ...f, ...patch }));

  const save = async () => {
    setSaving(true);
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name_ua: form.name_ua,
        name_ru: form.name_ru,
        desc_ua: form.desc_ua,
        desc_ru: form.desc_ru,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : null,
        image_url: form.image_url,
        in_stock: form.in_stock,
      }),
    });
    setSaving(false);
    onSaved();
  };

  const toggleStock = async () => {
    const next = !form.in_stock;
    update({ in_stock: next });
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ in_stock: next }),
    });
    onSaved();
  };

  const del = async () => {
    if (!confirm("Видалити цей смак?")) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    onDeleted();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-panel2 rounded-xl p-3 border border-white/10">
      <ImageUploader value={form.image_url} onChange={(url) => update({ image_url: url })} />

      <div className="flex flex-col gap-1 min-w-[140px]">
        <input
          className="bg-transparent border-b border-white/15 text-sm px-1 py-0.5 outline-none focus:border-neon-purple"
          placeholder="Назва UA"
          value={form.name_ua}
          onChange={(e) => update({ name_ua: e.target.value })}
        />
        <input
          className="bg-transparent border-b border-white/15 text-sm px-1 py-0.5 outline-none focus:border-neon-purple"
          placeholder="Назва RU"
          value={form.name_ru}
          onChange={(e) => update({ name_ru: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1 min-w-[220px]">
        <textarea
          className="bg-transparent border-b border-white/15 text-xs px-1 py-0.5 outline-none focus:border-neon-purple resize-none"
          placeholder="Опис UA"
          rows={2}
          value={form.desc_ua}
          onChange={(e) => update({ desc_ua: e.target.value })}
        />
        <textarea
          className="bg-transparent border-b border-white/15 text-xs px-1 py-0.5 outline-none focus:border-neon-purple resize-none"
          placeholder="Опис RU"
          rows={2}
          value={form.desc_ru}
          onChange={(e) => update({ desc_ru: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1 w-20">
        <input
          type="number"
          className="bg-transparent border-b border-white/15 text-sm px-1 py-0.5 outline-none focus:border-neon-purple w-full"
          placeholder="Ціна"
          value={form.price}
          onChange={(e) => update({ price: e.target.value as any })}
        />
        <input
          type="number"
          className="bg-transparent border-b border-white/15 text-sm px-1 py-0.5 outline-none focus:border-neon-purple w-full"
          placeholder="Стара ціна"
          value={form.old_price ?? ""}
          onChange={(e) => update({ old_price: (e.target.value || null) as any })}
        />
      </div>

      <button
        onClick={toggleStock}
        className={`text-xs px-3 py-2 rounded-full font-semibold border transition ${
          form.in_stock
            ? "bg-neon-green/20 border-neon-green text-neon-green"
            : "bg-white/5 border-white/20 text-white/50"
        }`}
      >
        {form.in_stock ? "Є в наявності" : "Немає"}
      </button>

      <button
        onClick={save}
        disabled={saving}
        className="text-xs px-3 py-2 rounded-full bg-neon-purple/80 hover:bg-neon-purple font-semibold"
      >
        {saving ? "..." : "Зберегти"}
      </button>
      <button onClick={del} className="text-xs px-3 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30">
        Видалити
      </button>
    </div>
  );
}
