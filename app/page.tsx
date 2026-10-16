"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Tile from "@/components/Tile";
import { useLang } from "@/components/LangProvider";
import { categories } from "@/lib/data";

gsap.registerPlugin(useGSAP);

export default function Hub() {
  const { t, pick } = useLang();
  const root = useRef<HTMLDivElement>(null);

  // Intro timeline: mascot drops in and bounces, title pops, then tiles spring
  // up one after another. Skipped entirely for users who prefer reduced motion.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();
        tl.from(".mascot", { y: -220, rotate: -25, opacity: 0, duration: 0.9, ease: "bounce.out" })
          .from(".hub-title", { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.4")
          .from(".section-heading", { x: -40, opacity: 0, duration: 0.4, stagger: 0.25 }, "-=0.2")
          .from(".tile", { y: 70, scale: 0.5, opacity: 0, rotate: () => gsap.utils.random(-12, 12), stagger: 0.06, duration: 0.55, ease: "back.out(1.8)" }, "-=0.5");

        // gentle idle float + occasional wave for the mascot
        gsap.to(".mascot", { y: -12, repeat: -1, yoyo: true, duration: 1.6, ease: "sine.inOut", delay: 1.4 });
        gsap.to(".mascot-wave", { rotate: 18, transformOrigin: "70% 80%", repeat: -1, yoyo: true, duration: 0.35, ease: "sine.inOut", repeatDelay: 2.5, delay: 2 });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  const extras = [
    { href: "/poems", emoji: "📖", label: t("poems"), color: "bg-berry-600" },
    { href: "/game", emoji: "🧩", label: t("game"), color: "bg-grape-600" },
    { href: "/drag", emoji: "🎯", label: t("drag"), color: "bg-leaf-600" },
    { href: "/typing", emoji: "⌨️", label: t("typing"), color: "bg-orange-600" },
    { href: "/exam", emoji: "📝", label: t("exam"), color: "bg-sky-600" },
  ];

  return (
    <div ref={root}>
      <div className="mb-8 flex items-center justify-center gap-4">
        <div className="mascot text-7xl md:text-8xl" aria-hidden>
          🦜<span className="mascot-wave inline-block text-4xl">👋</span>
        </div>
        <h1 className="hub-title font-display text-4xl font-extrabold text-sky-600 md:text-5xl">
          {t("title")} ✨
        </h1>
      </div>

      <h2 className="section-heading mb-3 font-display text-2xl font-bold text-leaf-600">🌱 Learn</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {categories.map((c, i) => (
          <div key={c.slug} className="tile">
            <Tile href={`/learn/${c.slug}`} emoji={c.emoji} label={pick(c.label)} color={c.color} index={i} />
          </div>
        ))}
      </div>

      <h2 className="section-heading mb-3 mt-10 font-display text-2xl font-bold text-orange-600">🎯 Practice &amp; Play</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {extras.map((e, i) => (
          <div key={e.href} className="tile">
            <Tile {...e} index={i + categories.length} />
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        <a href="/admin" className="underline">
          {t("admin")}
        </a>
      </p>
    </div>
  );
}
