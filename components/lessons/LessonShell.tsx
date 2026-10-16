"use client";

import { CSSProperties, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import LangSwitch from "@/components/LangSwitch";
import { useLang } from "@/components/LangProvider";
import { pop } from "@/lib/audio";

export interface ShellTheme {
  bg: string;
  band: string;
  ink: string;
  edge: string;
  pattern?: string;
  size?: string;
}

/**
 * Full-screen lesson frame: coloured stage on top, a mountain-edged band at the
 * bottom for navigation, a close button and the language switch. Every module
 * passes its own theme, so each one looks different.
 */
export default function LessonShell({
  theme,
  closeHref,
  onNext,
  onPrev,
  nav,
  children,
}: {
  theme: ShellTheme;
  closeHref: string;
  onNext?: () => void;
  onPrev?: () => void;
  nav: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const { t } = useLang();

  // lock page scroll behind the full-screen lesson
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // keyboard: Esc closes, arrow keys move between steps
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.push(closeHref);
      if (e.key === "ArrowRight") onNext?.();
      if (e.key === "ArrowLeft") onPrev?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeHref, onNext, onPrev, router]);

  const vars = { background: theme.bg, "--ink": theme.ink, "--edge": theme.edge } as CSSProperties;

  return (
    <section aria-label="Lesson" className="fixed inset-0 z-50 flex flex-col" style={vars}>
      {theme.pattern && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: theme.pattern, backgroundSize: theme.size }}
        />
      )}

      <div className="relative z-10 flex items-center justify-between gap-3 p-3 md:p-5">
        <LangSwitch />
        <button
          onClick={() => {
            pop(400);
            router.push(closeHref);
          }}
          aria-label={t("close")}
          className="grid h-12 w-12 place-items-center rounded-2xl border-b-4 border-black/25 bg-berry-400 text-2xl font-black text-white shadow-lg transition hover:scale-110 active:scale-90"
        >
          ✕
        </button>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
        {children}
      </div>

      <div className="relative z-10" style={{ background: theme.band, height: "26vh", minHeight: 150 }}>
        {/* mountain skyline along the top edge of the band */}
        <svg
          aria-hidden
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute bottom-full left-0 block h-16 w-full md:h-20"
          fill={theme.band}
        >
          <path d="M0 80V52l150-38 110 30 140-40 150 46 130-34 150 38 140-42 150 40 120-26 200 14V80z" />
        </svg>
        <div className="relative flex h-full items-center justify-between gap-3 px-5 md:px-16">{nav}</div>
      </div>
    </section>
  );
}
