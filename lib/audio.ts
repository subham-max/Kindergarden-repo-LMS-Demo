import type { Lang } from "./data";

let current: HTMLAudioElement | null = null;

/** Tiny synthesized "pop" so every tap gives instant feedback. */
export function pop(freq = 660) {
  if (typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 400);
  } catch {
    /* ignore */
  }
}

const speechLang: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", tr: "en-IN" };

/**
 * Plays a recorded file if `src` exists, otherwise falls back to the browser's
 * speech synthesis (English and Hindi only). Tribal languages have no TTS, so
 * for those you MUST supply recorded audio files.
 */
export async function speak(text: string, lang: Lang, src?: string): Promise<void> {
  if (typeof window === "undefined") return;
  pop();
  if (src) {
    try {
      const res = await fetch(src, { method: "HEAD" });
      if (res.ok) {
        current?.pause();
        current = new Audio(src);
        await current.play();
        return;
      }
    } catch {
      /* fall through */
    }
  }
  if (lang === "tr") return; // no TTS for tribal languages
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace("⟨T⟩ ", ""));
    u.lang = speechLang[lang];
    u.rate = 0.85;
    u.pitch = 1.1;
    window.speechSynthesis.speak(u);
  }
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  current?.pause();
  window.speechSynthesis?.cancel();
}
