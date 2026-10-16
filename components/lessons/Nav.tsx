"use client";

import { pop } from "@/lib/audio";

export function ArrowButton({
  dir,
  onClick,
  label,
  color = "#5ecb6b",
  pulse = false,
}: {
  dir: "left" | "right";
  onClick: () => void;
  label: string;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <button
      onClick={() => {
        pop(dir === "right" ? 720 : 520);
        onClick();
      }}
      aria-label={label}
      className={`grid h-16 w-16 place-items-center rounded-full border-b-8 border-black/25 text-4xl font-black text-white shadow-lg transition hover:scale-110 active:scale-90 md:h-20 md:w-20 md:text-5xl ${
        pulse ? "animate-floaty" : ""
      }`}
      style={{ background: color }}
    >
      {dir === "left" ? "←" : "→"}
    </button>
  );
}

export function Dots({ count, active }: { count: number; active: number }) {
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`Step ${active + 1} of ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`block rounded-full transition-all ${i === active ? "h-5 w-5 bg-white" : "h-3 w-3 bg-white/50"}`}
        />
      ))}
    </div>
  );
}

/** Bottom-band controls shared by every lesson: back arrow, step dots, next arrow. */
export function LessonNav({
  steps,
  step,
  canBack,
  onBack,
  onNext,
  backLabel,
  nextLabel,
  color,
}: {
  steps: number;
  step: number;
  canBack: boolean;
  onBack: () => void;
  onNext: () => void;
  backLabel: string;
  nextLabel: string;
  color: string;
}) {
  return (
    <>
      <div className="flex w-20 justify-start">
        {canBack && <ArrowButton dir="left" onClick={onBack} label={backLabel} color={color} />}
      </div>
      <Dots count={steps} active={step} />
      <div className="flex w-20 justify-end">
        <ArrowButton dir="right" onClick={onNext} label={nextLabel} color={color} pulse />
      </div>
    </>
  );
}
