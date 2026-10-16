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
import { categories } from "@/lib/data";
import { moduleThemes } from "@/lib/themes";
import { speak } from "@/lib/audio";
import { jellyVars, sparkle } from "@/lib/fx";

gsap.registerPlugin(useGSAP);

const LAST = 1; // steps: 0 = picture + name + description, 1 = three languages + video

/**
 * Lesson page for the culture modules (animals, food, festivals, dress, dress
 * code). Colours and layout come from the module's theme: "split" puts the
 * picture beside the text, "center" stacks them inside a decorated frame.
 */
export default function TopicLesson({ slug, id }: { slug: string; id: string }) {
  const { lang, pick, t } = useLang();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  const cat = categories.find((c) => c.slug === slug);
  const theme = moduleThemes[slug];
  const items = cat?.items ?? [];
  const idx = items.findIndex((i) => i.id === id);
  const item = idx >= 0 ? items[idx] : undefined;
  const itemId = item?.id;
  const center = theme?.layout === "center";

  useEffect(() => {
    setStep(0);
  }, [id]);

  useEffect(() => {
    if (!item || step !== 0) return;
    speak(`${item.title[lang]}. ${item.description[lang]}`, lang, item.audio?.replace("{lang}", lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, step, lang]);

  useGSAP(
    () => {
      if (!item) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (step === 0) {
          gsap
            .timeline()
            .from(".disc", { scale: 0, rotate: -90, opacity: 0, duration: 0.7, ease: "back.out(1.7)" })
            .from(".pic", { y: -400, opacity: 0, duration: 0.8, ease: "bounce.out" }, 0.25)
            .from(".title", { x: center ? 0 : 60, y: center ? 40 : 0, opacity: 0, duration: 0.5, ease: "power3.out" }, 0.5)
            .from(".desc", { opacity: 0, y: 24, duration: 0.5 }, 0.7)
            .add(() => sparkle(root.current?.querySelector(".pic")), 0.9);
          gsap.to(".pic", { y: -8, repeat: -1, yoyo: true, duration: 1.8, ease: "sine.inOut", delay: 1.5 });
        } else {
          gsap.from(".lang-card", { y: 70, opacity: 0, scale: 0.8, stagger: 0.12, duration: 0.5, ease: "back.out(1.8)", clearProps: "transform,opacity" });
        }
      });
    },
    { scope: root, dependencies: [step, itemId, lang], revertOnUpdate: true }
  );

  const next = () => {
    if (step < LAST) {
      setStep(step + 1);
      return;
    }
    const nx = items[idx + 1];
    router.push(nx ? `/learn/${slug}/${nx.id}` : `/learn/${slug}`);
  };
  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      return;
    }
    const pv = items[idx - 1];
    if (pv) router.push(`/learn/${slug}/${pv.id}`);
  };

  if (!cat || !theme || !item) return notFound();

  const size = "min(38vh,58vw)";

  return (
    <div ref={root}>
      <LessonShell
        theme={theme}
        closeHref={`/learn/${slug}`}
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
            color={theme.band === "#d4a000" ? "#b8860b" : theme.ink}
          />
        }
      >
        {step === 0 ? (
          <div
            className={`flex w-full max-w-5xl items-center justify-center ${
              center ? "flex-col gap-3 text-center md:gap-4" : "flex-col gap-6 md:flex-row md:gap-12"
            }`}
          >
            <div
              className={`disc grid shrink-0 place-items-center shadow-xl ${center ? "rounded-[2.5rem] border-[10px] border-dashed border-white/90" : "rounded-full border-[10px] border-white/90"}`}
              style={{ width: size, height: center ? "min(22vh,40vw)" : size, background: theme.band, backgroundImage: theme.pattern, backgroundSize: theme.size }}
            >
              <span className={`pic leading-none drop-shadow-lg ${center ? "text-[min(14vh,22vw)]" : "text-[min(20vh,30vw)]"}`}>
                {item.emoji}
              </span>
            </div>
            <div className={center ? "max-w-2xl" : "max-w-xl text-center md:text-left"}>
              <h1 className={`title jelly ${center ? "text-[min(6vh,9vw)]" : "text-[min(8vh,11vw)]"}`} style={jellyVars(theme.ink, theme.edge)}>
                {pick(item.title)}
              </h1>
              <p
                className={`desc mt-2 font-display font-bold leading-snug text-slate-700 ${
                  center ? "text-[min(2.8vh,4.6vw)]" : "text-[min(3.2vh,5vw)]"
                }`}
              >
                {pick(item.description)}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid w-full max-w-5xl items-center gap-5 md:grid-cols-2">
            <div className="mx-auto w-full" style={{ maxWidth: "min(100%, 52vh)" }}>
              <MediaSlot src={item.video} label={`${item.title.en}: add /public/media/video/${item.id}.mp4`} />
            </div>
            <LangCards names={item.title} accent={theme.band} stack />
          </div>
        )}
      </LessonShell>
    </div>
  );
}
