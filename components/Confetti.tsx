"use client";

import { motion } from "framer-motion";

const pieces = Array.from({ length: 28 }, (_, i) => i);
const palette = ["#ff6b9d", "#4cb4ff", "#5ecb6b", "#ffd23f", "#a78bfa", "#ff9f43"];

export default function Confetti() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((i) => (
        <motion.span
          key={i}
          className="absolute top-0 block h-3 w-3 rounded-sm"
          style={{ left: `${(i * 37) % 100}%`, background: palette[i % palette.length] }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", rotate: 360 + i * 20, opacity: 0.9 }}
          transition={{ duration: 2.2 + (i % 5) * 0.3, delay: (i % 7) * 0.08, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
