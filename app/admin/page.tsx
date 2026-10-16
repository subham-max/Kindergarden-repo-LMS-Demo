"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import { MAX_POEM_LINES } from "@/lib/data";
import { DEFAULT_EXAM, ExamSettings, loadExamSettings, saveExamSettings } from "@/lib/settings";

export default function AdminPage() {
  const { t } = useLang();
  const [s, setS] = useState<ExamSettings>(DEFAULT_EXAM);
  const [saved, setSaved] = useState(false);
  const [poemText, setPoemText] = useState("Line one\nLine two\nLine three\nLine four");

  useEffect(() => setS(loadExamSettings()), []);

  const lineCount = poemText.split("\n").filter((l) => l.trim()).length;
  const poemOk = lineCount > 0 && lineCount <= MAX_POEM_LINES;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-4xl font-extrabold text-sky-600">🛠️ {t("admin")}</h1>
      <p className="rounded-xl bg-sun-300/40 p-3 text-sm">
        Demo only: settings are saved in this browser. In the real app, protect this route with login and roles.
      </p>

      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 font-display text-2xl font-extrabold">⏱️ Exam timing</h2>
        <label className="mb-4 block">
          <span className="font-bold">Duration (minutes)</span>
          <input
            type="number"
            min={1}
            max={180}
            value={s.durationMinutes}
            onChange={(e) => setS({ ...s, durationMinutes: Math.max(1, Number(e.target.value) || 1) })}
            className="mt-1 w-full rounded-xl border-4 border-sky-100 px-4 py-3 text-lg"
          />
        </label>
        <label className="mb-4 block">
          <span className="font-bold">Attempts allowed</span>
          <input
            type="number"
            min={1}
            max={10}
            value={s.attempts}
            onChange={(e) => setS({ ...s, attempts: Math.max(1, Number(e.target.value) || 1) })}
            className="mt-1 w-full rounded-xl border-4 border-sky-100 px-4 py-3 text-lg"
          />
        </label>
        <label className="mb-4 flex items-center gap-3">
          <input
            type="checkbox"
            checked={s.shuffle}
            onChange={(e) => setS({ ...s, shuffle: e.target.checked })}
            className="h-6 w-6"
          />
          <span className="font-bold">Shuffle questions</span>
        </label>
        <button
          onClick={() => {
            saveExamSettings(s);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
          }}
          className="rounded-full bg-leaf-400 px-6 py-3 font-display text-lg font-bold text-white shadow hover:scale-105 active:scale-95"
        >
          Save
        </button>
        {saved && <span className="ml-3 font-bold text-leaf-600">✓ Saved</span>}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-2 font-display text-2xl font-extrabold">📖 Poem editor (max {MAX_POEM_LINES} lines)</h2>
        <textarea
          value={poemText}
          onChange={(e) => setPoemText(e.target.value)}
          rows={6}
          className="w-full rounded-xl border-4 border-sky-100 px-4 py-3 text-lg"
        />
        <p className={`mt-2 font-bold ${poemOk ? "text-leaf-600" : "text-berry-600"}`}>
          {lineCount} line{lineCount === 1 ? "" : "s"} — {poemOk ? "OK to publish" : `too long: maximum is ${MAX_POEM_LINES}`}
        </p>
        <button
          disabled={!poemOk}
          className="mt-3 rounded-full bg-grape-600 px-6 py-3 font-display text-lg font-bold text-white shadow enabled:hover:scale-105 disabled:opacity-40"
        >
          Publish poem
        </button>
      </section>
    </div>
  );
}
