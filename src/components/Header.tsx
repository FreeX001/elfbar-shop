"use client";

import Link from "next/link";
import { useLang } from "@/context/LangContext";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { lang, setLang, t } = useLang();
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-bg/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link
          href="/"
          className="font-display text-sm sm:text-xl font-bold tracking-wide neon-text truncate min-w-0"
        >
          ELF<span className="text-neon-cyan">BAR</span>.SHOP
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <div className="flex rounded-full border border-white/15 overflow-hidden text-[10px] sm:text-xs font-semibold">
            <button
              onClick={() => setLang("ua")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 transition ${lang === "ua" ? "bg-neon-purple text-white" : "text-white/60 hover:text-white"}`}
            >
              UA
            </button>
            <button
              onClick={() => setLang("ru")}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 transition ${lang === "ru" ? "bg-neon-purple text-white" : "text-white/60 hover:text-white"}`}
            >
              RU
            </button>
          </div>

          <button
            onClick={openCart}
            className="relative px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full neon-border text-xs sm:text-sm font-semibold hover:shadow-neon transition shrink-0"
          >
            {t.cart}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
