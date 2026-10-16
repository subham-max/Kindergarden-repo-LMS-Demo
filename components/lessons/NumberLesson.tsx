"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LessonShell from "./LessonShell";
import { LessonNav } from "./Nav";
import LangCards from "./LangCards";
import MediaSlot from "@/components/MediaSlot";
import { useLang } from "@/components/LangProvider";
import { numbers } from "@/lib/data";
import { moduleThemes } from "@/lib/themes";
import { pop, speak } from "@/lib/audio";
import { sparkle } from "@/lib/fx";

gsap.registerPlugin(useGSAP);

const FRUITS = ["🍎", "🥭", "🍊", "🍌", "🍇", "🍓", "🍍", "🍉", "🥥", "🍐"];
const LAST = 1; // steps: 0 = count the objects, 1 = three languages + video

export default function NumberLesson({ id }: { id: string }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const theme = moduleThemes.numbers;
  const root = useRef<HTMLDivElement>(null);
  const badge = useRef<HTMLSpanElement>(null);
  const [step, setStep] = useState(0);
  const [replay, setReplay] = useState(0);

  const idx = numbers.findIndex((n) => n.id === id);
  const item = idx >= 0 ? numbers[idx] : undefined;
  const n = idx + 1;

  useEffect(() => {
    setStep(0);
  }, [id]);

  // Counting animation: each object pops in, a tone plays, the badge ticks up
  // and the number word is spoken. "Count again" replays it.
  useGSAP(
    () => {
      if (!item || step !== 0) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (badge.current) badge.current.textContent = "0";
        gsap.from(".digit", { scale: 0, rotate: -40, opacity: 0, duration: 0.7, ease: "back.out(2.2)" });
        const objs = gsap.utils.toArray<HTMLElement>(".obj");
        const tl = gsap.timeline({ delay: 0.7 });
        objs.forEach((o, i) => {
          tl.from(o, { scale: 0, rotate: -40, opacity: 0, duration: 0.4, ease: "back.out(2.5)" }, i * 0.65).add(() => {
            pop(480 + i * 70);
            if (badge.current) badge.current.textContent = String(i + 1);
            speak(numbers[i].description[lang], lang);
          }, i * 0.65);
        });
        tl.add(() => sparkle(root.current?.querySelector(".digit")), objs.length * 0.65 + 0.2);
      });
    },
    { scope: root, dependencies: [step, id, lang, replay], revertOnUpdate: true }
  );

  useGSAP(
    () => {
      if (step !== 1) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lang-card", { y: 70, opacity: 0, scale: 0.8, stagger: 0.12, duration: 0.5, ease: "back.out(1.8)", clearProps: "transform,opacity" });
      });
    },
    { scope: root, dependencies: [step, id, lang], revertOnUpdate: true }
  );

  const next = () => {
    if (step < LAST) {
      setStep(step + 1);
      return;
    }
    const nx = numbers[idx + 1];
    router.push(nx ? `/learn/numbers/${nx.id}` : "/learn/numbers");
  };
  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    const pv = numbers[idx - 1];
    if (pv) router.push(`/learn/numbers/${pv.id}`);
  };

  if (!item) return notFound();
  const fruit = FRUITS[idx % FRUITS.length];

  return (
    <div ref={root}>
      <LessonShell
        theme={theme}
        closeHref="/learn/numbers"
        onNext={next}
        onPrev={prev}
        nav={
          <LessonNav
            steps={LAST + 1}
            step={step}
            canBack={step > 0 || idx > 0}
            onBack={prev}
            onNext={next}
            backLabel={t("back")}
            nextLabel={t("next")}
            color={theme.ink}
          />
        }
      >
        {step === 0 ? (
          <div className="flex w-full flex-wrap items-center justify-center gap-x-[6vw] gap-y-4">
            <div className="digit grid place-items-center rounded-full bg-white/70 shadow-lg" style={{ width: "min(38vh,60vw)", height: "min(38vh,60vw)" }}>
              <span className="jelly text-[min(26vh,38vw)]">{n}</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative rounded-[2rem] border-8 border-white/80 bg-white/50 p-4 shadow-lg">
                <span
                  ref={badge}
                  aria-live="polite"
                  className="absolute -right-4 -top-5 grid h-14 w-14 place-items-center rounded-full bg-berry-400 font-display text-2xl font-extrabold text-white shadow-lg"
                >
                  {n}
                </span>
                <div className="grid grid-cols-5 gap-1 text-[min(8vh,11vw)] leading-none">
                  {Array.from({ length: n }, (_, i) => (
                    <span key={i} className="obj grid place-items-center">
                      {fruit}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setReplay((r) => r + 1)}
                className="rounded-full border-b-4 border-black/20 bg-sun-400 px-6 py-2 font-display text-xl font-bold text-slate-800 shadow-md transition hover:scale-105 active:scale-95"
              >
                🔁 {t("replay")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid w-full max-w-5xl items-center gap-5 md:grid-cols-2">
            <div className="mx-auto w-full" style={{ maxWidth: "min(100%, 52vh)" }}>
              <MediaSlot label={`Add /public/media/video/number-${item.id}.mp4`} />
            </div>
            <LangCards names={item.description} accent={theme.band} stack />
          </div>
        )}
      </LessonShell>
    </div>
  );
}
