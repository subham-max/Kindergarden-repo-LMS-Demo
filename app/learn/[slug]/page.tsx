"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/components/LangProvider";
import { categories, Item, Lang, numbers } from "@/lib/data";
import { alphabetSets, letterTheme } from "@/lib/alphabet";
import { ModuleTheme, moduleThemes } from "@/lib/themes";
import { jellyVars } from "@/lib/fx";
import { pop } from "@/lib/audio";
import DressStudio from "@/components/DressStudio";

gsap.registerPlugin(useGSAP);

// Module landing page: a grid of tiles. Tapping a tile opens that item's own
// full-screen lesson page (/learn/{module}/{item}). No popups.
export default function ModulePage() {
  const { slug } = useParams<{ slug: string }>();
  // Traditional Dress has its own interactive dress-up studio instead of the tile grid.
  return slug === "dress" ? <DressStudio /> : <ModuleGrid />;
}

function ModuleGrid() {
  const { slug } = useParams<{ slug: string }>();
  const { lang, pick } = useLang();
  const root = useRef<HTMLDivElement>(null);
  const cat = categories.find((c) => c.slug === slug);
  const theme = moduleThemes[slug];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tile", {
          scale: 0,
          opacity: 0,
          rotate: () => gsap.utils.random(-15, 15),
          stagger: 0.03,
          duration: 0.5,
          ease: "back.out(2)",
          clearProps: "transform,opacity",
        });
      });
    },
    { scope: root, dependencies: [slug, lang] }
  );

  if (!cat || !theme) return notFound();

  return (
    <div
      ref={root}
      className="rounded-[2rem] p-5 shadow-lg md:p-8"
      style={{ background: theme.bg, backgroundImage: theme.pattern, backgroundSize: theme.size, border: `6px solid ${theme.band}` }}
    >
      <h1 className="mb-6 font-display text-4xl font-extrabold" style={{ color: theme.band }}>
        {cat.emoji} {pick(cat.label)}
      </h1>

      {slug === "alphabet" ? (
        <AlphabetGrid lang={lang} />
      ) : slug === "numbers" ? (
        <NumberGrid lang={lang} theme={theme} />
      ) : (
        <TopicGrid slug={slug} items={cat.items} theme={theme} />
      )}
    </div>
  );
}

function AlphabetGrid({ lang }: { lang: Lang }) {
  const set = alphabetSets[lang];
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      {set.map((l, i) => {
        const th = letterTheme(i);
        return (
          <Link
            key={l.id}
            href={`/learn/alphabet/${l.id}`}
            onClick={() => pop(500 + i * 25)}
            aria-label={l.big}
            className="tile grid aspect-square place-items-center rounded-3xl border-b-[10px] shadow-lg transition-transform hover:-translate-y-1 hover:rotate-1 active:scale-95"
            style={{ background: th.bg, borderColor: th.band }}
          >
            <span className="jelly text-[clamp(2.4rem,6.5vw,4.4rem)]" style={jellyVars(th.ink, th.edge)}>
              {l.big}
              {l.small}
            </span>
          </Link>
        );
      })}

      {/* shortcuts to the other modules, like the "more" tiles in the reference */}
      <Link
        href="/learn/numbers"
        onClick={() => pop(800)}
        className="tile col-span-3 flex h-28 items-center justify-center gap-3 self-center rounded-3xl border-b-[10px] border-black/20 bg-sky-400 font-display text-2xl font-extrabold text-white shadow-lg transition-transform hover:-translate-y-1 active:scale-95 sm:col-span-2"
      >
        🔢 Numbers →
      </Link>
      <Link
        href="/poems"
        onClick={() => pop(850)}
        className="tile col-span-3 flex h-28 items-center justify-center gap-3 self-center rounded-3xl border-b-[10px] border-black/20 bg-berry-400 font-display text-2xl font-extrabold text-white shadow-lg transition-transform hover:-translate-y-1 active:scale-95 sm:col-span-2"
      >
        📖 Poems →
      </Link>
    </div>
  );
}

function NumberGrid({ lang, theme }: { lang: Lang; theme: ModuleTheme }) {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
      {numbers.map((n, i) => (
        <Link
          key={n.id}
          href={`/learn/numbers/${n.id}`}
          onClick={() => pop(480 + i * 45)}
          className="tile flex aspect-square flex-col items-center justify-center rounded-full border-b-[10px] bg-white shadow-lg transition-transform hover:-translate-y-1 hover:scale-105 active:scale-95"
          style={{ borderColor: theme.band }}
        >
          <span className="jelly text-[clamp(2.6rem,6vw,4rem)]" style={jellyVars(theme.ink, theme.edge)}>
            {n.title[lang]}
          </span>
          <span className="font-display text-lg font-bold text-slate-600">{n.description[lang]}</span>
        </Link>
      ))}
    </div>
  );
}

function TopicGrid({ slug, items, theme }: { slug: string; items: Item[]; theme: ModuleTheme }) {
  const { pick } = useLang();
  const center = theme.layout === "center";
  return (
    <div className={`grid gap-5 ${center ? "sm:grid-cols-2 md:grid-cols-3" : "md:grid-cols-2"}`}>
      {items.map((item, i) => (
        <Link
          key={item.id}
          href={`/learn/${slug}/${item.id}`}
          onClick={() => pop(500 + i * 40)}
          className={`tile flex rounded-3xl border-b-[10px] bg-white p-5 shadow-lg transition-transform hover:-translate-y-1 active:scale-95 ${
            center ? "flex-col items-center text-center" : "items-center gap-5"
          }`}
          style={{ borderColor: theme.band }}
        >
          <span
            className="grid h-24 w-24 shrink-0 place-items-center rounded-full text-6xl"
            style={{ background: theme.bg, backgroundImage: theme.pattern, backgroundSize: theme.size }}
          >
            {item.emoji}
          </span>
          <span className={center ? "mt-3" : ""}>
            <span className="block font-display text-2xl font-extrabold" style={{ color: theme.ink }}>
              {pick(item.title)}
            </span>
            <span className="mt-1 block text-slate-600">{pick(item.description)}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
