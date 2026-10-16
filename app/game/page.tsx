"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import Confetti from "@/components/Confetti";
import { animals, Item } from "@/lib/data";
import { pop, speak } from "@/lib/audio";

interface Card {
  uid: string;
  item: Item;
  kind: "picture" | "word";
}

function buildDeck(): Card[] {
  const pick = animals.slice(0, 4);
  const deck: Card[] = pick.flatMap((item) => [
    { uid: `${item.id}-p`, item, kind: "picture" as const },
    { uid: `${item.id}-w`, item, kind: "word" as const },
  ]);
  return deck.sort(() => Math.random() - 0.5);
}

export default function GamePage() {
  const { lang, pick, t } = useLang();
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => setDeck(buildDeck()), []);

  const won = useMemo(() => deck.length > 0 && matched.length === deck.length / 2, [matched, deck]);

  const flip = (card: Card) => {
    if (flipped.length === 2 || flipped.includes(card.uid) || matched.includes(card.item.id)) return;
    pop(650);
    if (card.kind === "word") speak(pick(card.item.title), lang);
    const next = [...flipped, card.uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((uid) => deck.find((d) => d.uid === uid)!);
      if (a.item.id === b.item.id && a.kind !== b.kind) {
        setTimeout(() => {
          pop(900);
          setMatched((m) => [...m, a.item.id]);
          setFlipped([]);
        }, 500);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const restart = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  return (
    <div>
      {won && <Confetti />}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-4xl font-extrabold text-grape-600">🧩 {t("game")}</h1>
        <span className="rounded-full bg-white px-4 py-2 font-display text-xl font-bold shadow">Moves: {moves}</span>
      </div>
      <p className="mb-4 text-lg">Match each animal picture with its name.</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {deck.map((card) => {
          const open = flipped.includes(card.uid) || matched.includes(card.item.id);
          return (
            <button
              key={card.uid}
              onClick={() => flip(card)}
              aria-label={open ? pick(card.item.title) : "Hidden card"}
              className="h-40 [perspective:800px]"
            >
              <motion.div
                className="relative h-full w-full [transform-style:preserve-3d]"
                animate={{ rotateY: open ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              >
                <div className="absolute inset-0 grid place-items-center rounded-3xl border-b-8 border-black/15 bg-grape-400 text-6xl text-white shadow-lg [backface-visibility:hidden]">
                  ❓
                </div>
                <div
                  className={`absolute inset-0 grid place-items-center rounded-3xl border-b-8 border-black/15 p-2 text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    matched.includes(card.item.id) ? "bg-leaf-400 text-white" : "bg-sun-300"
                  }`}
                >
                  {card.kind === "picture" ? (
                    <span className="text-7xl">{card.item.emoji}</span>
                  ) : (
                    <span className="font-display text-2xl font-extrabold">{pick(card.item.title)}</span>
                  )}
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>

      {won && (
        <div className="mt-8 text-center">
          <p className="font-display text-4xl font-extrabold text-berry-600">🎉 {t("great")}</p>
          <button
            onClick={restart}
            className="mt-4 rounded-full bg-orange-400 px-8 py-4 font-display text-xl font-bold text-white shadow-md hover:scale-105 active:scale-95"
          >
            {t("again")}
          </button>
        </div>
      )}
    </div>
  );
}
