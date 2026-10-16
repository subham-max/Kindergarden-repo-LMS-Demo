"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Confetti from "@/components/Confetti";
import { questions } from "@/lib/data";
import { DEFAULT_EXAM, ExamSettings, loadExamSettings } from "@/lib/settings";
import { pop } from "@/lib/audio";

type Phase = "intro" | "running" | "result";

export default function ExamPage() {
  const { pick, t } = useLang();
  const [settings, setSettings] = useState<ExamSettings>(DEFAULT_EXAM);
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [remaining, setRemaining] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const expiresAt = useRef(0);

  useEffect(() => setSettings(loadExamSettings()), []);

  // Countdown derived from a fixed expiry timestamp, so refreshing the tick
  // loop can never extend the time. In production the SERVER owns expiresAt.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((expiresAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        setTimedOut(true);
        setPhase("result");
      }
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  const start = () => {
    pop(740);
    expiresAt.current = Date.now() + settings.durationMinutes * 60_000;
    setRemaining(settings.durationMinutes * 60);
    setAnswers({});
    setTimedOut(false);
    setPhase("running");
  };

  const score = questions.filter((q) => answers[q.id] === q.answer).length;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const urgent = remaining <= 15;

  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
        <div className="animate-floaty text-7xl">📝</div>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-sky-600">{t("exam")}</h1>
        <ul className="mt-4 space-y-1 text-lg">
          <li>⏱️ Time allowed: <b>{settings.durationMinutes} min</b> (set by admin)</li>
          <li>❓ Questions: <b>{questions.length}</b></li>
          <li>🔁 Attempts allowed: <b>{settings.attempts}</b></li>
        </ul>
        <button
          onClick={start}
          className="mt-6 rounded-full bg-leaf-400 px-10 py-4 font-display text-2xl font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          {t("start")} ▶
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const pass = score >= Math.ceil(questions.length / 2);
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
        {pass && <Confetti />}
        <div className="text-7xl">{pass ? "🏆" : "💪"}</div>
        {timedOut && <p className="mt-2 font-display text-xl font-bold text-berry-600">⏰ Time is up!</p>}
        <h1 className="mt-2 font-display text-5xl font-extrabold text-sky-600">
          {score} / {questions.length}
        </h1>
        <p className="mt-2 font-display text-2xl text-leaf-600">{pass ? t("great") : "Keep practising!"}</p>
        <button
          onClick={() => setPhase("intro")}
          className="mt-6 rounded-full bg-orange-400 px-8 py-3 font-display text-xl font-bold text-white shadow-md hover:scale-105 active:scale-95"
        >
          {t("again")}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`sticky top-[76px] z-30 mb-6 flex items-center justify-between rounded-2xl p-4 text-white shadow-lg ${
          urgent ? "bg-berry-400" : "bg-sky-400"
        }`}
      >
        <span className="font-display text-xl font-bold">
          {Object.keys(answers).length} / {questions.length}
        </span>
        <motion.span
          animate={urgent ? { scale: [1, 1.15, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="font-display text-4xl font-extrabold tabular-nums"
        >
          ⏱️ {mm}:{ss}
        </motion.span>
      </div>

      <div className="space-y-6">
        {questions.map((q, qi) => (
          <div key={q.id} className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 font-display text-2xl font-extrabold">
              {qi + 1}. {pick(q.prompt)}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {q.options.map((o, oi) => (
                <button
                  key={oi}
                  onClick={() => {
                    pop(600 + oi * 80);
                    setAnswers((a) => ({ ...a, [q.id]: oi }));
                  }}
                  className={`rounded-2xl border-4 px-4 py-4 font-display text-xl font-bold transition active:scale-95 ${
                    answers[q.id] === oi
                      ? "border-grape-600 bg-grape-400 text-white"
                      : "border-sky-100 bg-sky-50 text-slate-700 hover:border-sky-400"
                  }`}
                >
                  {pick(o)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => setPhase("result")}
          className="rounded-full bg-leaf-400 px-10 py-4 font-display text-2xl font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
        >
          {t("submit")} ✓
        </button>
      </div>
    </div>
  );
}
