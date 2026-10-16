"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import MediaSlot from "@/components/MediaSlot";
import { poems, Poem, MAX_POEM_LINES } from "@/lib/data";
import { speak, stopSpeaking } from "@/lib/audio";

gsap.registerPlugin(useGSAP);

const LINE_MS = 2400; // time per line; replace with per-line timestamps from real audio

export default function PoemsPage() {
  const { lang, pick, t } = useLang();
  const [poem, setPoem] = useState<Poem>(poems[0]);
  const [activeLine, setActiveLine] = useState<number>(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const box = useRef<HTMLDivElement>(null);

  const lines = poem.lines[lang].slice(0, MAX_POEM_LINES);

  // Word-by-word "karaoke" highlight for the active line. Words are rendered as
  // real <span>s by React (split on spaces) instead of splitting characters, so
  // Hindi and tribal-script combining marks are never broken apart.
  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".w");
      gsap.killTweensOf(words);
      gsap.set(words, { clearProps: "all" });
      if (activeLine < 0) return;

      const lineWords = gsap.utils.toArray<HTMLElement>(`[data-line="${activeLine}"] .w`);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const total = (LINE_MS / 1000) * 0.85;
      const each = total / Math.max(lineWords.length, 1);

      gsap.to(lineWords, {
        backgroundColor: "#ffb800",
        color: "#ffffff",
        y: reduce ? 0 : -5,
        scale: reduce ? 1 : 1.12,
        duration: Math.min(0.25, each),
        stagger: each,
        ease: "back.out(2)",
      });
    },
    { scope: box, dependencies: [activeLine, lang, poem.id] }
  );

  const stop = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    stopSpeaking();
    setActiveLine(-1);
  };

  const readAlong = () => {
    stop();
    lines.forEach((line, i) => {
      timers.current.push(
        setTimeout(() => {
          setActiveLine(i);
          speak(line, lang, undefined);
        }, i * LINE_MS)
      );
    });
    timers.current.push(setTimeout(() => setActiveLine(-1), lines.length * LINE_MS));
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl font-extrabold text-berry-600">📖 {t("poems")}</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        {poems.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              stop();
              setPoem(p);
            }}
            className={`${p.color} rounded-full px-5 py-3 font-display text-lg font-bold text-white shadow transition hover:scale-105 active:scale-95 ${
              poem.id === p.id ? "ring-4 ring-grape-400" : "opacity-80"
            }`}
          >
            {p.emoji} {pick(p.title)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div ref={box} className="rounded-3xl bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl font-extrabold text-sky-600">
              {poem.emoji} {pick(poem.title)}
            </h2>
            <button
              onClick={readAlong}
              className="rounded-full bg-leaf-400 px-5 py-3 font-display text-lg font-bold text-white shadow-md transition hover:scale-105 active:scale-95"
            >
              ▶ Read along
            </button>
          </div>

          <ol className="space-y-3">
            {lines.map((line, i) => (
              <motion.li
                key={`${poem.id}-${lang}-${i}`}
                data-line={i}
                animate={{ scale: activeLine === i ? 1.03 : 1, x: activeLine === i ? 8 : 0 }}
                className={`cursor-pointer rounded-2xl px-4 py-3 font-display text-2xl font-bold transition-colors ${
                  activeLine === i ? "bg-sun-300/40 text-orange-600" : "bg-sky-50 text-slate-700"
                }`}
                onClick={() => {
                  stop();
                  setActiveLine(i);
                  speak(line, lang);
                }}
              >
                {line.split(" ").map((word, wi) => (
                  <span key={wi} className="w mr-1.5 inline-block rounded-lg px-1">
                    {word}
                  </span>
                ))}
              </motion.li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-slate-500">Tap any line to hear it. Poems are limited to {MAX_POEM_LINES} lines.</p>
        </div>

        <div>
          <MediaSlot label={`Poem video — add /public/media/video/poem-${poem.id}.mp4`} />
        </div>
      </div>
    </div>
  );
}
