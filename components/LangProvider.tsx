"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, Tri, UI } from "@/lib/data";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof UI) => string;
  pick: (v: Tri) => string;
}

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portal.lang") as Lang | null;
      if (saved === "en" || saved === "hi" || saved === "tr") setLangState(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("portal.lang", l);
    } catch {
      /* ignore */
    }
  };

  const pick = (v: Tri) => v[lang];
  const t = (key: keyof typeof UI) => UI[key][lang];

  return <LangContext.Provider value={{ lang, setLang, t, pick }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}
