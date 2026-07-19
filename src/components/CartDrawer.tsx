"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLang } from "@/context/LangContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, clear } = useCart();
  const { t, lang } = useLang();
  const [telegramUsername, setTelegramUsername] = useState<string>("");

  useEffect(() => {
    fetch("/api/public-settings")
      .then((r) => r.json())
      .then((d) => setTelegramUsername(d.telegram_username || ""))
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const buildMessage = () => {
    const lines = items.map(
      (i) => `• ${i.seriesName} — ${i.flavorName} x${i.qty} = ${i.price * i.qty} грн`
    );
    const greeting = lang === "ua" ? "Привіт, хочу це купити" : "Привет, хочу это купить";
    return `${greeting}:\n${lines.join("\n")}\n\n${t.total}: ${total} грн`;
  };

  const telegramHref = telegramUsername
    ? `https://t.me/${telegramUsername}?text=${encodeURIComponent(buildMessage())}`
    : "#";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/70" onClick={closeCart} />
      <div className="relative w-full max-w-md h-full bg-panel border-l border-white/10 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="font-display text-lg font-bold neon-text">{t.yourOrder}</h2>
          <button onClick={closeCart} className="text-white/60 hover:text-white text-sm">
            ✕ {t.close}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 space-y-4">
          {items.length === 0 && <p className="text-white/50 text-sm">{t.emptyCart}</p>}
          {items.map((i) => (
            <div key={i.productId} className="flex gap-3 items-center bg-panel2 rounded-xl p-3 neon-border">
              {i.image ? (
                <img src={i.image} alt={i.flavorName} className="w-14 h-14 object-cover rounded-lg" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white/10" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{i.seriesName}</p>
                <p className="text-xs text-white/50 truncate">{i.flavorName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20"
                    onClick={() => updateQty(i.productId, i.qty - 1)}
                  >
                    −
                  </button>
                  <span className="text-sm w-5 text-center">{i.qty}</span>
                  <button
                    className="w-6 h-6 rounded bg-white/10 hover:bg-white/20"
                    onClick={() => updateQty(i.productId, i.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-neon-cyan">{i.price * i.qty} ₴</p>
                <button
                  className="text-xs text-white/40 hover:text-neon-pink mt-1"
                  onClick={() => removeItem(i.productId)}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 p-5 space-y-3">
            <p className="text-xs text-white/50">{t.orderHint}</p>
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t.total}</span>
              <span className="text-neon-cyan">{total} ₴</span>
            </div>
            <a
              href={telegramHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (!telegramUsername) return;
                setTimeout(() => clear(), 800);
              }}
              className={`block text-center w-full py-3 rounded-full font-bold transition ${
                telegramUsername
                  ? "bg-gradient-to-r from-neon-purple to-neon-pink hover:shadow-neon"
                  : "bg-white/10 pointer-events-none opacity-50"
              }`}
            >
              {t.writeTelegram}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
