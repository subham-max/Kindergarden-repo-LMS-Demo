"use client";

import { useEffect, useState } from "react";

/**
 * Shows a <video> if the file exists in /public, otherwise a friendly
 * placeholder. Replace `src` values in lib/data.ts with real clips.
 */
export default function MediaSlot({ src, label }: { src?: string; label: string }) {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!src) return;
    fetch(src, { method: "HEAD" })
      .then((r) => alive && setExists(r.ok && (r.headers.get("content-type") ?? "").startsWith("video")))
      .catch(() => alive && setExists(false));
    return () => {
      alive = false;
    };
  }, [src]);

  if (src && exists) {
    return <video src={src} controls playsInline className="aspect-video w-full rounded-2xl bg-black" />;
  }
  return (
    <div className="grid aspect-video w-full place-items-center rounded-2xl border-4 border-dashed border-sky-400 bg-sky-50 text-center">
      <div>
        <div className="text-5xl">🎬</div>
        <p className="mt-2 font-display text-lg font-bold text-sky-600">Video placeholder</p>
        <p className="px-4 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
