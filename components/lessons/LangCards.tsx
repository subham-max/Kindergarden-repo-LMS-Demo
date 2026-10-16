"use client";

import { Lang, TRIBAL_NAME } from "@/lib/data";
import { speak } from "@/lib/audio";

const labels: Record<Lang, string> = { en: "English", hi: "हिन्दी", tr: TRIBAL_NAME };

/** The same word in all three languages, each card plays its own audio. */
export default function LangCards({
  names,
  accent,
  stack = false,
}: {
  names: Record<Lang, string>;
  accent: string;
  stack?: boolean;
}) {
  return (
    <div className={`grid gap-3 ${stack ? "" : "sm:grid-cols-3"}`}>
      {(["en", "hi", "tr"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => speak(names[l], l)}
          className="lang-card rounded-2xl border-b-8 bg-white p-4 text-left shadow-lg transition-transform hover:-translate-y-1 active:scale-95"
          style={{ borderColor: accent }}
        >
          <div className="font-display text-sm font-bold uppercase" style={{ color: accent }}>
            🔊 {labels[l]}
          </div>
          <div className="font-display text-3xl font-extrabold text-slate-800">{names[l]}</div>
        </button>
      ))}
    </div>
  );
}
