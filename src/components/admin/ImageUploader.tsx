"use client";

import { useRef, useState } from "react";

export default function ImageUploader({
  value,
  onChange,
  size = "w-20 h-20",
}: {
  value: string | null;
  onChange: (url: string) => void;
  size?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    }
  };

  return (
    <div
      className={`relative ${size} rounded-xl overflow-hidden border border-white/15 bg-panel2 flex items-center justify-center shrink-0 cursor-pointer hover:border-neon-cyan`}
      onClick={() => inputRef.current?.click()}
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-[10px] text-white/40 px-1 text-center">{loading ? "..." : "+ фото"}</span>
      )}
      {loading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs">...</div>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
