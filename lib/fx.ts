import gsap from "gsap";
import type { CSSProperties } from "react";

/** CSS variables that colour the .jelly lettering. */
export const jellyVars = (ink: string, edge: string) => ({ "--ink": ink, "--edge": edge }) as CSSProperties;

/**
 * Split text into user-perceived characters. Hindi letters with vowel signs
 * (matras) or the chandrabindu stay together as one unit, so highlighting the
 * "first letter" of a Hindi word never tears a letter apart.
 */
export function graphemes(s: string): string[] {
  try {
    const Seg = (Intl as any).Segmenter;
    if (Seg) {
      return Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(s), (x: any) => x.segment as string);
    }
  } catch {
    /* fall through */
  }
  return Array.from(s);
}

/** Small burst of coloured dots from the centre of an element. */
export function sparkle(el: Element | null | undefined, n = 12) {
  if (!el || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#ffd23f", "#ff6b9d", "#4cb4ff", "#5ecb6b", "#a78bfa"];
  const r = el.getBoundingClientRect();
  const layer = document.createElement("div");
  layer.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
  document.body.appendChild(layer);
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  for (let i = 0; i < n; i++) {
    const d = document.createElement("span");
    const s = gsap.utils.random(6, 14);
    d.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${s}px;height:${s}px;border-radius:50%;background:${colors[i % colors.length]}`;
    layer.appendChild(d);
    const ang = (Math.PI * 2 * i) / n + gsap.utils.random(-0.3, 0.3);
    const dist = gsap.utils.random(50, 120);
    gsap.to(d, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, opacity: 0, scale: 0.2, duration: 0.9, ease: "power2.out" });
  }
  setTimeout(() => layer.remove(), 1100);
}
