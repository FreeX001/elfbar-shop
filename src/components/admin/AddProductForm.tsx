"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";

export default function AddProductForm({ seriesId, onAdded }: { seriesId: number; onAdded: () => void }) {
  const [nameUa, setNameUa] = useState("");
  const [nameRu, setNameRu] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!nameUa || !nameRu || !price) return;
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        series_id: seriesId,
        name_ua: nameUa,
        name_ru: nameRu,
        price: Number(price),
        image_url: image,
        in_stock: true,
      }),
    });
    setSaving(false);
    setNameUa("");
    setNameRu("");
    setPrice("");
    setImage(null);
    onAdded();
  };

  return (
    <div className="flex flex-wrap items-center gap-3 bg-panel/60 border border-dashed border-white/15 rounded-xl p-3">
      <ImageUploader value={image} onChange={setImage} size="w-14 h-14" />
      <input
        placeholder="Смак UA"
        value={nameUa}
        onChange={(e) => setNameUa(e.target.value)}
        className="bg-transparent border-b border-white/15 text-sm px-1 py-1 outline-none focus:border-neon-purple w-32"
      />
      <input
        placeholder="Смак RU"
        value={nameRu}
        onChange={(e) => setNameRu(e.target.value)}
        className="bg-transparent border-b border-white/15 text-sm px-1 py-1 outline-none focus:border-neon-purple w-32"
      />
      <input
        placeholder="Ціна"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="bg-transparent border-b border-white/15 text-sm px-1 py-1 outline-none focus:border-neon-purple w-20"
      />
      <button
        onClick={submit}
        disabled={saving}
        className="text-xs px-4 py-2 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30 font-semibold"
      >
        {saving ? "..." : "+ Додати смак"}
      </button>
    </div>
  );
}
