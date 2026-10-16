"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { pop } from "@/lib/audio";

/**
 * Big, bouncy hub button. Framer Motion handles hover/tap only; the ENTRANCE
 * animation is done by GSAP on the wrapping element (see app/page.tsx), so the
 * two libraries never fight over the same transform.
 */
export default function Tile({
  href,
  emoji,
  label,
  color,
  index = 0,
}: {
  href: string;
  emoji: string;
  label: string;
  color: string;
  index?: number;
}) {
  return (
    <motion.div whileHover={{ scale: 1.08, rotate: -2 }} whileTap={{ scale: 0.92 }}>
      <Link
        href={href}
        onClick={() => pop(540 + index * 40)}
        className={`${color} flex h-44 flex-col items-center justify-center gap-2 rounded-3xl border-b-8 border-black/15 p-4 text-center shadow-lg`}
      >
        <span className="text-6xl drop-shadow-sm">{emoji}</span>
        <span className="font-display text-xl font-extrabold leading-tight text-white drop-shadow">{label}</span>
      </Link>
    </motion.div>
  );
}
