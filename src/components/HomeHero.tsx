"use client";
import { useLang } from "@/context/LangContext";

export default function HomeHero() {
  const { t } = useLang();
  return (
    <div className="relative overflow-hidden rounded-3xl neon-border mt-8 px-6 py-14 sm:py-20 text-center">
      <div className="absolute inset-0 bg-smoke opacity-70 pointer-events-none" />
      <h1 className="relative font-display text-3xl sm:text-5xl font-black neon-text">
        {t.heroTitle}
      </h1>
      <p className="relative mt-4 text-white/60 max-w-xl mx-auto">{t.heroSubtitle}</p>
    </div>
  );
}
