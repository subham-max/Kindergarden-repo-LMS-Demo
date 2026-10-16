"use client";

import { motion } from "framer-motion";
import { useLang } from "./LangProvider";
import { Lang, TRIBAL_NAME } from "@/lib/data";
import { pop } from "@/lib/audio";

const langs: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "tr", label: TRIBAL_NAME },
];

/** Three-way language pill, shared by the site header and the lesson pages. */
export default function LangSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div role="group" aria-label="Language" className="flex gap-1 rounded-full bg-sky-50 p-1 shadow-sm">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => {
            pop(780);
            setLang(l.code);
          }}
          aria-pressed={lang === l.code}
          className="relative rounded-full px-4 py-2 font-display text-lg font-bold"
        >
          {lang === l.code && (
            <motion.span
              layoutId="lang-pill"
              className="absolute inset-0 rounded-full bg-sky-400"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className={`relative ${lang === l.code ? "text-white" : "text-sky-600"}`}>{l.label}</span>
        </button>
      ))}
    </div>
  );
}
