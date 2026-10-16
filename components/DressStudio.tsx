"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/components/LangProvider";
import LangSwitch from "@/components/LangSwitch";
import LangCards from "@/components/lessons/LangCards";
import MediaSlot from "@/components/MediaSlot";
import Confetti from "@/components/Confetti";
import { categories, dress } from "@/lib/data";
import { moduleThemes } from "@/lib/themes";
import { jellyVars, sparkle } from "@/lib/fx";
import { pop, speak } from "@/lib/audio";

gsap.registerPlugin(useGSAP);

// Where each garment flies in from (relative to its place on the figure).
const FLY: Record<string, { x: number; y: number; rotate: number }> = {
  headgear: { x: 0, y: -170, rotate: -25 },
  jacket: { x: -260, y: 0, rotate: -15 },
  beads: { x: 260, y: -70, rotate: 20 },
  skirt: { x: -240, y: 130, rotate: 12 },
};

const BEAD_COLORS = ["#d6336c", "#ffb800", "#2f9e44", "#1b84d9", "#7048e8"];

/**
 * Traditional Dress module: instead of a grid + lesson pages it is a dress-up
 * studio. Tap a garment in the wardrobe (or on the figure) to put it on or take
 * it off; a panel shows its name in all three languages with audio and video.
 * The figure and garments are original drawings (SVG), swap them for real art.
 */
export default function DressStudio({ initialId }: { initialId?: string }) {
  const { lang, pick, t } = useLang();
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const prevWorn = useRef<Set<string>>(new Set());
  const theme = moduleThemes.dress;
  const cat = categories.find((c) => c.slug === "dress")!;

  const startId = initialId && dress.some((d) => d.id === initialId) ? initialId : dress[0].id;
  const [worn, setWorn] = useState<string[]>(initialId && startId === initialId ? [initialId] : []);
  const [selected, setSelected] = useState<string>(startId);
  const [video, setVideo] = useState(false);

  const item = dress.find((d) => d.id === selected) ?? dress[0];
  const done = worn.length === dress.length;

  // Esc leaves the studio
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push("/");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Garments fly on / off, only for the ones that changed since the last render.
  useGSAP(
    () => {
      const was = prevWorn.current;
      const now = new Set(worn);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let added = false;

      dress.forEach((d) => {
        const el = root.current?.querySelector(`[data-garment="${d.id}"]`);
        if (!el) return;
        const on = now.has(d.id);
        const wasOn = was.has(d.id);
        if (on && !wasOn) {
          added = true;
          if (reduce) {
            gsap.set(el, { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 });
          } else {
            const f = FLY[d.id] ?? { x: -200, y: 0, rotate: 0 };
            gsap.fromTo(
              el,
              { opacity: 0, x: f.x, y: f.y, rotate: f.rotate, scale: 0.5, transformOrigin: "50% 50%" },
              { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, duration: 0.85, ease: "back.out(1.7)", onComplete: () => sparkle(el) }
            );
          }
        } else if (!on && wasOn) {
          gsap.to(el, { opacity: 0, y: 30, scale: 0.8, duration: 0.3, transformOrigin: "50% 50%" });
        } else if (!on && !wasOn) {
          gsap.set(el, { opacity: 0 });
        }
      });

      if (added && !reduce) {
        gsap.fromTo(".fig", { y: 0 }, { y: -14, yoyo: true, repeat: 1, duration: 0.18, ease: "power1.out", delay: 0.55 });
      }
      prevWorn.current = now;
    },
    { scope: root, dependencies: [worn.join(",")] }
  );

  // When everything is on, the figure dances.
  useEffect(() => {
    const fig = root.current?.querySelector(".fig");
    if (!fig || !done) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tw = gsap.to(fig, { rotate: 4, svgOrigin: "160 520", yoyo: true, repeat: -1, duration: 0.35, ease: "sine.inOut", delay: 1 });
    return () => {
      tw.kill();
      gsap.to(fig, { rotate: 0, duration: 0.2 });
    };
  }, [done]);

  const toggle = (id: string) => {
    const it = dress.find((d) => d.id === id);
    if (!it) return;
    setSelected(id);
    setVideo(false);
    setWorn((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
    speak(`${it.title[lang]}. ${it.description[lang]}`, lang, it.audio?.replace("{lang}", lang));
  };

  const garment = (id: string) =>
    ({
      "data-garment": id,
      "aria-hidden": true,
      className: "cursor-pointer",
      onClick: () => toggle(id),
      style: { opacity: 0, pointerEvents: worn.includes(id) ? "auto" : "none" } as React.CSSProperties,
    }) as const;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-clip"
      style={{ background: theme.bg, backgroundImage: theme.pattern, backgroundSize: theme.size }}
    >
      {done && <Confetti />}

      <div className="flex items-center justify-between gap-3 p-3 md:p-5">
        <LangSwitch />
        <h1 className="hidden font-display text-3xl font-extrabold md:block" style={{ color: theme.band }}>
          👗 {pick(cat.label)}
        </h1>
        <Link
          href="/"
          onClick={() => pop(400)}
          aria-label={t("close")}
          className="grid h-12 w-12 place-items-center rounded-2xl border-b-4 border-black/25 bg-berry-400 text-2xl font-black text-white shadow-lg transition hover:scale-110 active:scale-90"
        >
          ✕
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 pb-10 lg:grid-cols-[230px_minmax(0,1fr)_380px] lg:items-center">
        {/* wardrobe */}
        <div className="order-2 lg:order-1">
          <p className="mb-2 font-display text-lg font-bold" style={{ color: theme.band }}>
            {t("dressHint")}
          </p>
          <div className="flex gap-3 overflow-x-auto p-1 pb-3 lg:flex-col lg:overflow-visible">
            {dress.map((d) => {
              const on = worn.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggle(d.id)}
                  aria-pressed={on}
                  className="relative flex min-w-[190px] items-center gap-3 rounded-2xl border-b-8 bg-white p-3 text-left shadow-lg transition-transform hover:-translate-y-1 active:scale-95 lg:min-w-0"
                  style={{ borderColor: theme.band, outline: selected === d.id ? `4px solid ${theme.ink}` : "none", outlineOffset: 2 }}
                >
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-3xl"
                    style={{ background: theme.bg, backgroundImage: theme.pattern, backgroundSize: theme.size }}
                  >
                    {d.emoji}
                  </span>
                  <span className="font-display text-lg font-extrabold leading-tight text-slate-800">{pick(d.title)}</span>
                  {on && (
                    <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-leaf-400 text-lg font-black text-white shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => {
              pop(300);
              setWorn([]);
            }}
            disabled={worn.length === 0}
            className="mt-2 rounded-full bg-white px-4 py-2 font-display text-base font-bold shadow enabled:hover:scale-105 disabled:opacity-40"
            style={{ color: theme.band }}
          >
            ↺ {t("dressReset")}
          </button>
        </div>

        {/* stage */}
        <div className="order-1 flex flex-col items-center lg:order-2">
          <svg
            viewBox="0 0 320 560"
            role="img"
            aria-label="Child figure to dress up"
            className="aspect-[320/560] h-[46vh] max-h-[560px] overflow-visible lg:h-[min(74vh,600px)]"
          >
            <defs>
              <pattern id="weaveA" width="22" height="22" patternUnits="userSpaceOnUse">
                <rect width="22" height="22" fill="#d6336c" />
                <rect x="0" width="7" height="22" fill="#ffb800" />
                <rect x="11" width="4" height="22" fill="#1b84d9" />
                <rect x="18" width="2" height="22" fill="#fff1b8" />
              </pattern>
              <pattern id="weaveB" width="30" height="30" patternUnits="userSpaceOnUse">
                <rect width="30" height="30" fill="#2f9e44" />
                <rect width="30" height="9" fill="#ffb800" />
                <rect y="14" width="30" height="6" fill="#d6336c" />
                <path d="M0 26 L7 22 L14 26 L21 22 L28 26" stroke="#fff1b8" strokeWidth="2" fill="none" />
              </pattern>
              <pattern id="cane" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="10" height="10" fill="#d9a85a" />
                <rect width="10" height="3" fill="#a9742c" />
              </pattern>
            </defs>

            {/* stage platform */}
            <ellipse cx="160" cy="532" rx="140" ry="22" fill={theme.band} opacity=".9" />
            <ellipse cx="160" cy="522" rx="140" ry="20" fill="#fff" opacity=".75" />

            <g className="fig">
              {/* legs + shoes */}
              <rect x="128" y="380" width="26" height="122" rx="12" fill="#e8b08a" />
              <rect x="166" y="380" width="26" height="122" rx="12" fill="#e8b08a" />
              <ellipse cx="136" cy="508" rx="22" ry="10" fill="#3a2a20" />
              <ellipse cx="184" cy="508" rx="22" ry="10" fill="#3a2a20" />
              {/* plain shorts under everything */}
              <rect x="116" y="318" width="88" height="78" rx="14" fill="#f4e7c9" />
              {/* arms */}
              <path d="M112 190 L86 306" stroke="#e8b08a" strokeWidth="22" strokeLinecap="round" />
              <path d="M208 190 L234 306" stroke="#e8b08a" strokeWidth="22" strokeLinecap="round" />
              {/* plain top */}
              <rect x="112" y="172" width="96" height="160" rx="22" fill="#fff6e0" />
              {/* neck + head */}
              <rect x="146" y="150" width="28" height="30" fill="#e8b08a" />
              <circle cx="160" cy="105" r="48" fill="#e8b08a" />
              <path d="M112 100 Q108 52 160 52 Q212 52 208 100 Q188 76 160 76 Q132 76 112 100 Z" fill="#2b1d16" />
              <circle cx="143" cy="110" r="4.5" fill="#2b1d16" />
              <circle cx="177" cy="110" r="4.5" fill="#2b1d16" />
              <circle cx="136" cy="124" r="7" fill="#ff6b9d" opacity=".35" />
              <circle cx="184" cy="124" r="7" fill="#ff6b9d" opacity=".35" />
              <path d="M146 126 Q160 140 174 126" stroke="#2b1d16" strokeWidth="3.5" fill="none" strokeLinecap="round" />

              {/* garments: drawn bottom to top, hidden until worn */}
              <g {...garment("skirt")}>
                <path d="M110 316 L210 316 L236 446 L84 446 Z" fill="url(#weaveB)" stroke="#145c25" strokeWidth="3" strokeLinejoin="round" />
                <rect x="108" y="308" width="104" height="16" rx="6" fill="#2d3a8c" />
                <path d="M84 446 L236 446" stroke="#fff1b8" strokeWidth="5" />
              </g>

              <g {...garment("jacket")}>
                <path d="M104 178 L128 184 L108 318 L78 308 Z" fill="url(#weaveA)" stroke="#7d123c" strokeWidth="3" strokeLinejoin="round" />
                <path d="M216 178 L192 184 L212 318 L242 308 Z" fill="url(#weaveA)" stroke="#7d123c" strokeWidth="3" strokeLinejoin="round" />
                <path d="M106 176 Q160 160 214 176 L226 332 L94 332 Z" fill="url(#weaveA)" stroke="#7d123c" strokeWidth="3" strokeLinejoin="round" />
                <path d="M160 170 L160 332" stroke="#7d123c" strokeWidth="4" />
                <path d="M138 168 L160 198 L182 168 Z" fill="#fff1b8" stroke="#7d123c" strokeWidth="3" strokeLinejoin="round" />
              </g>

              <g {...garment("beads")}>
                {Array.from({ length: 13 }, (_, i) => {
                  const u = i / 12;
                  return (
                    <circle
                      key={i}
                      cx={126 + 68 * u}
                      cy={158 + 160 * u * (1 - u)}
                      r={i === 6 ? 10 : 6.5}
                      fill={BEAD_COLORS[i % BEAD_COLORS.length]}
                      stroke="#fff"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </g>

              <g {...garment("headgear")}>
                <path d="M196 42 Q228 4 246 26 Q224 32 204 56 Z" fill="#d6336c" stroke="#7d123c" strokeWidth="2" strokeLinejoin="round" />
                <path d="M188 46 Q212 -8 238 6 Q216 20 196 54 Z" fill="#1b84d9" stroke="#0b5a99" strokeWidth="2" strokeLinejoin="round" />
                <path d="M108 96 Q104 30 160 30 Q216 30 212 96 Q160 76 108 96 Z" fill="url(#cane)" stroke="#7a4a12" strokeWidth="3" strokeLinejoin="round" />
                <path d="M108 96 Q160 76 212 96" fill="none" stroke="#7a4a12" strokeWidth="5" />
              </g>
            </g>
          </svg>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full bg-white px-4 py-1 font-display text-lg font-bold shadow" style={{ color: theme.band }}>
              {worn.length} / {dress.length}
            </span>
            {done && (
              <span className="rounded-full bg-white px-5 py-1 font-display text-2xl font-extrabold shadow" style={{ color: theme.ink }}>
                🎉 {t("dressDone")}
              </span>
            )}
          </div>
        </div>

        {/* info panel */}
        <aside className="order-3 rounded-3xl border-[6px] bg-white/90 p-5 shadow-xl" style={{ borderColor: theme.band }}>
          <div className="flex items-center gap-4">
            <span
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-5xl"
              style={{ background: theme.bg, backgroundImage: theme.pattern, backgroundSize: theme.size }}
            >
              {item.emoji}
            </span>
            <h2 className="jelly text-[2.2rem]" style={jellyVars(theme.ink, theme.edge)}>
              {pick(item.title)}
            </h2>
          </div>
          <p className="mt-3 font-display text-xl font-bold leading-snug text-slate-700">{pick(item.description)}</p>
          <div className="mt-4">
            <LangCards names={item.title} accent={theme.band} stack />
          </div>
          <button
            onClick={() => {
              pop(700);
              setVideo((v) => !v);
            }}
            className="mt-4 rounded-full px-5 py-2 font-display text-lg font-bold text-white shadow transition hover:scale-105 active:scale-95"
            style={{ background: theme.band }}
          >
            🎬 {t("watch")}
          </button>
          {video && (
            <div className="mt-3">
              <MediaSlot src={item.video} label={`${item.title.en}: add /public/media/video/${item.id}.mp4`} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
