"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Lang, t } from "@/lib/i18n";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: ReturnType<typeof t> };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ua");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("lang") : null;
    if (saved === "ua" || saved === "ru") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: t(lang) }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
