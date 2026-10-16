"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/components/LangProvider";
import Confetti from "@/components/Confetti";
import { animals, Item } from "@/lib/data";
import { pop, speak } from "@/lib/audio";

gsap.registerPlugin(useGSAP, Draggable);

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

export default function DragGame() {
  const { lang, pick, t } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const matchedRef = useRef<Set<string>>(new Set());
  const langRef = useRef(lang);
  langRef.current = lang;

  const [round, setRound] = useState(0);
  const [pictures, setPictures] = useState<Item[]>([]);
  const [slots, setSlots] = useState<Item[]>([]);
  const [matched, setMatched] = useState<string[]>([]);

  // Build a fresh round on the client only (avoids hydration mismatch from shuffle)
  useEffect(() => {
    const pool = shuffle(animals).slice(0, 4);
    matchedRef.current = new Set();
    setMatched([]);
    setPictures(shuffle(pool));
    setSlots(shuffle(pool));
  }, [round]);

  const won = useMemo(() => pictures.length > 0 && matched.length === pictures.length, [matched, pictures]);

  useGSAP(
    () => {
      if (!pictures.length) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const d = (n: number) => (reduce ? 0 : n);

      if (!reduce) {
        gsap.from(".pic", { y: 80, opacity: 0, scale: 0.5, stagger: 0.1, duration: 0.6, ease: "back.out(1.8)" });
        gsap.from(".slot", { y: -40, opacity: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".pic");
      const instances = cards.map((card) =>
        Draggable.create(card, {
          type: "x,y",
          zIndexBoost: true,
          onPress() {
            pop(600);
            gsap.to(card, { scale: 1.15, rotate: gsap.utils.random(-6, 6), duration: d(0.15) });
          },
          onDragEnd() {
            const id = card.dataset.id!;
            const slotEls = gsap.utils.toArray<HTMLElement>(".slot");
            const hit = slotEls.find((s) => this.hitTest(s, "40%"));

            if (hit && hit.dataset.id === id && !matchedRef.current.has(id)) {
              // Correct: snap into the slot centre, then bounce
              const a = card.getBoundingClientRect();
              const b = hit.getBoundingClientRect();
              const dx = b.left + b.width / 2 - (a.left + a.width / 2);
              const dy = b.top + b.height / 2 - (a.top + a.height / 2);
              matchedRef.current.add(id);
              this.disable();
              pop(900);
              const item = animals.find((x) => x.id === id);
              if (item) speak(item.title[langRef.current], langRef.current);
              gsap
                .timeline()
                .to(card, { x: `+=${dx}`, y: `+=${dy}`, scale: 0.8, rotate: 0, duration: d(0.25), ease: "power2.out" })
                .to(card, { scale: 1, duration: d(0.5), ease: "elastic.out(1, 0.4)" })
                .to(hit, { backgroundColor: "#5ecb6b", color: "#fff", duration: d(0.2) }, 0.2);
              setMatched((m) => [...m, id]);
            } else {
              // Wrong: shake and spring back home
              pop(220);
              gsap
                .timeline()
                .to(card, { x: "+=12", duration: d(0.05), repeat: 3, yoyo: true })
                .to(card, { x: 0, y: 0, scale: 1, rotate: 0, duration: d(0.7), ease: "elastic.out(1, 0.5)" });
            }
          },
        })[0]
      );

      return () => instances.forEach((i) => i.kill());
    },
    { scope: root, dependencies: [pictures, slots], revertOnUpdate: true }
  );

  return (
    <div ref={root}>
      {won && <Confetti />}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-4xl font-extrabold text-leaf-600">🎯 {t("drag")}</h1>
        <span className="rounded-full bg-white px-4 py-2 font-display text-xl font-bold shadow">
          {matched.length} / {pictures.length}
        </span>
      </div>
      <p className="mb-6 text-lg">Drag each picture onto its name.</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {slots.map((s) => (
          <div
            key={s.id}
            data-id={s.id}
            className="slot grid h-28 place-items-center rounded-3xl border-4 border-dashed border-sky-400 bg-white/80 p-2 text-center font-display text-2xl font-extrabold text-sky-600"
          >
            {pick(s.title)}
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {pictures.map((p) => (
          <div key={p.id} className="grid h-32 place-items-center">
            <div
              data-id={p.id}
              role="img"
              aria-label={p.title.en}
              className={`pic ${p.color} grid h-28 w-28 cursor-grab touch-none select-none place-items-center rounded-3xl border-b-8 border-black/15 text-6xl shadow-lg active:cursor-grabbing`}
            >
              {p.emoji}
            </div>
          </div>
        ))}
      </div>

      {won && (
        <div className="mt-10 text-center">
          <p className="font-display text-4xl font-extrabold text-berry-600">🎉 {t("great")}</p>
          <button
            onClick={() => setRound((r) => r + 1)}
            className="mt-4 rounded-full bg-orange-400 px-8 py-4 font-display text-xl font-bold text-white shadow-md hover:scale-105 active:scale-95"
          >
            {t("again")}
          </button>
        </div>
      )}
    </div>
  );
}
