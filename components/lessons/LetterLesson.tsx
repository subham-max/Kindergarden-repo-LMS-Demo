"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LessonShell from "./LessonShell";
import { LessonNav } from "./Nav";
import LangCards from "./LangCards";
import MediaSlot from "@/components/MediaSlot";
import { useLang } from "@/components/LangProvider";
import { alphabetSets, letterTheme } from "@/lib/alphabet";
import { TRIBAL_NAME } from "@/lib/data";
import { speak } from "@/lib/audio";
import { graphemes, sparkle } from "@/lib/fx";

gsap.registerPlugin(useGSAP);

const LAST = 2; // steps: 0 = the letter, 1 = word + picture, 2 = three languages + video

export default function LetterLesson({ id }: { id: string }) {
  const { lang, t } = useLang();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const set = alphabetSets[lang];
  const idx = set.findIndex((l) => l.id === id);
  const letter = idx >= 0 ? set[idx] : undefined;
  const th = letterTheme(Math.max(idx, 0));
  const letterId = letter?.id;

  // Each language has its own letter set. If the language is switched while a
  // lesson is open, jump to the letter at the same position in the new set.
  const lastIdx = useRef(0);
  useEffect(() => {
    if (idx >= 0) lastIdx.current = idx;
  }, [idx]);
  useEffect(() => {
    if (idx === -1) router.replace(`/learn/alphabet/${set[Math.min(lastIdx.current, set.length - 1)].id}`);
  }, [idx, set, router]);

  useEffect(() => {
    setStep(0);
  }, [id]);

  // say the letter, then the word
  useEffect(() => {
    if (!letter) return;
    if (step === 0) speak(letter.big, lang);
    if (step === 1) speak(letter.word, lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterId, step, lang]);

  useGSAP(
    () => {
      if (!letter) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (step === 0) {
          gsap
            .timeline()
            .from(".big", { y: -500, rotate: -15, opacity: 0, duration: 0.9, ease: "bounce.out" })
            .from(".small", { scale: 0, rotate: 30, opacity: 0, duration: 0.6, ease: "back.out(2.5)" }, "-=0.15")
            .from(".gshadow", { scaleX: 0, opacity: 0, duration: 0.5 }, 0.5);
          gsap.to(".big", { y: -10, repeat: -1, yoyo: true, duration: 1.6, ease: "sine.inOut", delay: 1.3 });
        }
        if (step === 1) {
          gsap
            .timeline()
            .from(".pic", { y: -500, opacity: 0, duration: 0.9, ease: "bounce.out" })
            .from(".wl", { y: 90, scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: "back.out(2.2)" }, 0.15)
            .from(".gshadow", { scaleX: 0, opacity: 0, duration: 0.4 }, 0.6)
            .add(() => sparkle(root.current?.querySelector(".wl-first")), 0.7);
        }
        if (step === 2) {
          gsap.from(".lang-card", {
            y: 70,
            opacity: 0,
            scale: 0.8,
            stagger: 0.12,
            duration: 0.5,
            ease: "back.out(1.8)",
            clearProps: "transform,opacity",
          });
        }
      });
    },
    { scope: root, dependencies: [step, letterId, lang], revertOnUpdate: true }
  );

  const next = () => {
    if (!letter) return;
    if (step < LAST) {
      setStep(step + 1);
      return;
    }
    const nx = set[idx + 1];
    router.push(nx ? `/learn/alphabet/${nx.id}` : "/learn/alphabet");
  };

  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    const pv = set[idx - 1];
    if (pv) router.push(`/learn/alphabet/${pv.id}`);
  };

  if (!letter) return null;
  const chars = graphemes(letter.word);

  return (
    <div ref={root}>
      <LessonShell
        theme={{ bg: th.bg, band: th.band, ink: th.ink, edge: th.edge }}
        closeHref="/learn/alphabet"
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
            color={th.ink}
          />
        }
      >
        <div className="flex w-full flex-col items-center">
          {letter.placeholder && lang === "tr" && (
            <p className="mb-3 rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-slate-600">
              ⟨T⟩ placeholder letters. Replace with the reviewed {TRIBAL_NAME} alphabet.
            </p>
          )}

          {step === 0 && (
            <div className="flex items-end justify-center gap-[6vw]">
              <div className="relative">
                <span className="big jelly block text-[min(40vh,46vw)]">{letter.big}</span>
                <span className="gshadow absolute -bottom-2 left-1/2 h-5 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/20" />
              </div>
              {letter.small && (
                <div className="relative">
                  <span className="small jelly block text-[min(40vh,46vw)]">{letter.small}</span>
                  <span className="gshadow absolute -bottom-2 left-1/2 h-5 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/20" />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-wrap items-end justify-center gap-x-[5vw] gap-y-4">
              <div className="flex" aria-label={letter.word}>
                {chars.map((ch, i) =>
                  i === 0 ? (
                    <span key={i} className="wl wl-first jelly inline-block whitespace-pre text-[min(17vh,13vw)]">
                      {ch}
                    </span>
                  ) : (
                    <span
                      key={i}
                      className="wl inline-block whitespace-pre font-display text-[min(17vh,13vw)] font-extrabold leading-none text-slate-800"
                    >
                      {ch}
                    </span>
                  )
                )}
              </div>
              <div className="relative">
                <span className="pic block text-[min(26vh,26vw)] leading-none">{letter.emoji}</span>
                <span className="gshadow absolute -bottom-2 left-1/2 h-5 w-[80%] -translate-x-1/2 rounded-[50%] bg-black/20" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid w-full max-w-5xl items-center gap-5 md:grid-cols-2">
              <div className="mx-auto w-full" style={{ maxWidth: "min(100%, 52vh)" }}>
                <MediaSlot label={`Add /public/media/video/letter-${letter.id}.mp4`} />
              </div>
              <LangCards names={letter.names} accent={th.band} stack />
            </div>
          )}
        </div>
      </LessonShell>
    </div>
  );
}
