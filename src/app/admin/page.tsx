"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeriesBlock from "@/components/admin/SeriesBlock";
import type { SeriesWithProducts } from "@/lib/db";

export default function AdminPage() {
  const [series, setSeries] = useState<SeriesWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSlug, setNewSlug] = useState("");
  const [newNameUa, setNewNameUa] = useState("");
  const [newNameRu, setNewNameRu] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    const [seriesRes, settingsRes] = await Promise.all([
      fetch("/api/admin/series"),
      fetch("/api/admin/settings"),
    ]);
    const seriesData = await seriesRes.json();
    const settingsData = await settingsRes.json();
    setSeries(seriesData.series || []);
    setTelegramUsername(settingsData.settings?.telegram_username || "");
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addSeries = async () => {
    if (!newSlug || !newNameUa || !newNameRu) return;
    await fetch("/api/admin/series", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: newSlug, name_ua: newNameUa, name_ru: newNameRu }),
    });
    setNewSlug("");
    setNewNameUa("");
    setNewNameRu("");
    load();
  };

  const saveSettings = async () => {
    setSettingsMsg("");
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegram_username: telegramUsername,
        ...(newPassword ? { new_password: newPassword } : {}),
      }),
    });
    setNewPassword("");
    setSettingsMsg("Збережено ✓");
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black neon-text">Admin Panel</h1>
        <button onClick={logout} className="text-sm px-4 py-2 rounded-full border border-white/20 hover:border-neon-pink">
          Вийти
        </button>
      </div>

      <div className="neon-border bg-panel rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-lg">Налаштування</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-xs text-white/50 block mb-1">Telegram (кому пише покупець), без @</label>
            <input
              className="bg-panel2 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-neon-purple w-56"
              value={telegramUsername}
              onChange={(e) => setTelegramUsername(e.target.value)}
              placeholder="username"
            />
          </div>
          <div>
            <label className="text-xs text-white/50 block mb-1">Новий пароль адмінки (не обов'язково)</label>
            <input
              type="password"
              className="bg-panel2 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-neon-purple w-56"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="залишити пустим — не міняти"
            />
          </div>
          <button
            onClick={saveSettings}
            className="px-5 py-2 rounded-full font-semibold bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-neon"
          >
            Зберегти
          </button>
          {settingsMsg && <span className="text-neon-green text-sm">{settingsMsg}</span>}
        </div>
      </div>

      <div className="neon-border bg-panel rounded-2xl p-5 space-y-3">
        <h2 className="font-semibold text-lg">Нова лінійка (модель одноразки)</h2>
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="slug (напр. gh33000-pro)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="bg-panel2 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-neon-purple w-48"
          />
          <input
            placeholder="Назва UA"
            value={newNameUa}
            onChange={(e) => setNewNameUa(e.target.value)}
            className="bg-panel2 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-neon-purple w-48"
          />
          <input
            placeholder="Назва RU"
            value={newNameRu}
            onChange={(e) => setNewNameRu(e.target.value)}
            className="bg-panel2 border border-white/15 rounded-lg px-3 py-2 outline-none focus:border-neon-purple w-48"
          />
          <button
            onClick={addSeries}
            className="px-5 py-2 rounded-full font-semibold bg-neon-cyan/20 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan/30"
          >
            + Додати лінійку
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-white/40">Завантаження...</p>
      ) : (
        <div className="space-y-6">
          {series.map((s) => (
            <SeriesBlock key={s.id} series={s} onRefresh={load} />
          ))}
          {series.length === 0 && <p className="text-white/40">Ще немає жодної лінійки. Додайте вище.</p>}
        </div>
      )}
    </div>
  );
}
