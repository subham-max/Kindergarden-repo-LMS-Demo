"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Confetti from "@/components/Confetti";
import { typingPassages } from "@/lib/data";
import { pop } from "@/lib/audio";

export default function TypingPage() {
  const { lang, t } = useLang();
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const passages = typingPassages[lang];
  const target = passages[idx % passages.length].normalize("NFC");

  // reset when language changes
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (!startedAt || done) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [startedAt, done]);

  function reset(nextIdx = 0) {
    setIdx(nextIdx);
    setTyped("");
    setStartedAt(null);
    setDone(false);
    setNow(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const onChange = (v: string) => {
    if (done) return;
    const value = v.normalize("NFC");
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value);
    pop(value.length % 2 ? 700 : 620);
    if (value === target) {
      setNow(Date.now());
      setDone(true);
    }
  };

  const stats = useMemo(() => {
    const elapsedMin = startedAt ? Math.max((now - startedAt) / 60000, 1 / 600) : 0;
    let correct = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) correct++;
    const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
    const wpm = elapsedMin ? Math.round(correct / 5 / elapsedMin) : 0;
    return { wpm, accuracy };
  }, [typed, now, startedAt, target]);

  return (
    <div>
      {done && <Confetti />}
      <h1 className="mb-6 font-display text-4xl font-extrabold text-orange-600">⌨️ {t("typing")}</h1>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <p className="mb-4 select-none font-display text-3xl font-bold leading-relaxed" aria-label="Text to type">
          {Array.from(target).map((ch, i) => {
            const state = i >= typed.length ? "idle" : typed[i] === ch ? "ok" : "bad";
            return (
              <span
                key={i}
                className={
                  state === "ok"
                    ? "text-leaf-600"
                    : state === "bad"
                    ? "rounded bg-berry-400/30 text-berry-600"
                    : i === typed.length
                    ? "rounded bg-sun-300"
                    : "text-slate-400"
                }
              >
                {ch}
              </span>
            );
          })}
        </p>

        <input
          ref={inputRef}
          value={typed}
          onChange={(e) => onChange(e.target.value)}
          disabled={done}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          placeholder="Start typing here…"
          className="w-full rounded-2xl border-4 border-sky-400 px-4 py-4 font-display text-2xl focus:outline-none"
        />

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Stat label="WPM" value={stats.wpm} color="bg-sky-400" />
          <Stat label="Accuracy" value={`${stats.accuracy}%`} color="bg-leaf-400" />
        </div>

        {done && (
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 text-center">
            <p className="font-display text-4xl font-extrabold text-berry-600">🎉 {t("great")}</p>
            <button
              onClick={() => reset(idx + 1)}
              className="mt-4 rounded-full bg-orange-400 px-8 py-4 font-display text-xl font-bold text-white shadow-md transition hover:scale-105 active:scale-95"
            >
              {t("next")} →
            </button>
          </motion.div>
        )}
        {!done && typed.length > 0 && (
          <button onClick={() => reset(idx)} className="mt-4 text-sm text-slate-500 underline">
            {t("again")}
          </button>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Hindi typing needs a Hindi keyboard (or an on-screen InScript keyboard in the real app).
      </p>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className={`${color} rounded-2xl p-4 text-center text-white shadow`}>
      <div className="font-display text-5xl font-extrabold">{value}</div>
      <div className="font-display text-lg font-bold opacity-90">{label}</div>
    </div>
  );
}
