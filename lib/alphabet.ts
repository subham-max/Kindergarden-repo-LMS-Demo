// ---------------------------------------------------------------------------
// ALPHABET CONTENT. Each language has its OWN set of letters and example words,
// because a Hindi, Galo, Nyishi or Adi alphabet is not a translation of the
// English one. All words and pictures here are DUMMY data:
//   - en: the 26 English letters
//   - hi: a short sample of Hindi letters, each with a word that really starts
//         with that letter
//   - tr: the tribal-language set, currently a placeholder copy of the English
//         letters (flagged `placeholder`). Replace with the real reviewed letters.
// ---------------------------------------------------------------------------
import type { Lang } from "./data";

export interface LetterLesson {
  id: string; // used in the URL: /learn/alphabet/{id}
  big: string; // the letter, large (uppercase for Latin scripts)
  small?: string; // lowercase form, when the script has case
  word: string; // example word in THIS language, starts with the letter
  emoji: string; // stand-in picture; swap for real artwork
  names: Record<Lang, string>; // the picture's name in all three languages
  placeholder?: boolean;
}

type Row = [letter: string, emoji: string, en: string, hi: string];

const latin: Row[] = [
  ["A", "🍎", "Apple", "सेब"],
  ["B", "⚽", "Ball", "गेंद"],
  ["C", "🐱", "Cat", "बिल्ली"],
  ["D", "🐶", "Dog", "कुत्ता"],
  ["E", "🐘", "Elephant", "हाथी"],
  ["F", "🐟", "Fish", "मछली"],
  ["G", "🍇", "Grapes", "अंगूर"],
  ["H", "🏠", "House", "घर"],
  ["I", "🐛", "Insect", "कीड़ा"],
  ["J", "🏺", "Jug", "जग"],
  ["K", "🪁", "Kite", "पतंग"],
  ["L", "🦁", "Lion", "शेर"],
  ["M", "🥭", "Mango", "आम"],
  ["N", "🪺", "Nest", "घोंसला"],
  ["O", "🍊", "Orange", "संतरा"],
  ["P", "🦜", "Parrot", "तोता"],
  ["Q", "👑", "Queen", "रानी"],
  ["R", "🐰", "Rabbit", "खरगोश"],
  ["S", "☀️", "Sun", "सूरज"],
  ["T", "🐯", "Tiger", "बाघ"],
  ["U", "☂️", "Umbrella", "छाता"],
  ["V", "🚐", "Van", "वैन"],
  ["W", "💧", "Water", "पानी"],
  ["X", "🎵", "Xylophone", "जाइलोफ़ोन"],
  ["Y", "🐂", "Yak", "याक"],
  ["Z", "🦓", "Zebra", "ज़ेबरा"],
];

const hindi: Row[] = [
  ["अ", "🍍", "Pineapple", "अनानास"],
  ["आ", "🥭", "Mango", "आम"],
  ["उ", "🦉", "Owl", "उल्लू"],
  ["ऊ", "🐪", "Camel", "ऊँट"],
  ["ऐ", "👓", "Glasses", "ऐनक"],
  ["क", "🪷", "Lotus", "कमल"],
  ["ख", "🐰", "Rabbit", "खरगोश"],
  ["ग", "🐄", "Cow", "गाय"],
  ["घ", "🏠", "House", "घर"],
  ["च", "🌙", "Moon", "चाँद"],
  ["ज", "🚢", "Ship", "जहाज़"],
  ["त", "🌟", "Star", "तारा"],
];

function build(rows: Row[], wordIn: "en" | "hi", cased: boolean, idOf: (i: number, r: Row) => string, placeholder = false): LetterLesson[] {
  return rows.map((r, i) => ({
    id: idOf(i, r),
    big: r[0],
    small: cased ? r[0].toLowerCase() : undefined,
    word: wordIn === "hi" ? r[3] : r[2],
    emoji: r[1],
    names: { en: r[2], hi: r[3], tr: `⟨T⟩ ${r[2]}` },
    placeholder,
  }));
}

export const alphabetSets: Record<Lang, LetterLesson[]> = {
  en: build(latin, "en", true, (_, r) => r[0].toLowerCase()),
  hi: build(hindi, "hi", false, (i) => `hi-${i + 1}`),
  tr: build(latin, "en", true, (_, r) => r[0].toLowerCase(), true),
};

// Each letter gets its own colour pair, used on both its grid tile and its lesson page.
export interface LetterTheme {
  bg: string;
  band: string;
  ink: string;
  edge: string;
}

const letterThemes: LetterTheme[] = [
  { bg: "#ffe3cf", band: "#ff7a3d", ink: "#12b5a6", edge: "#0a6b62" },
  { bg: "#d9f4e6", band: "#2fa36b", ink: "#8b5cf6", edge: "#4a2bb0" },
  { bg: "#dfe9ff", band: "#3b6fe0", ink: "#ff8a1f", edge: "#a84e00" },
  { bg: "#ffe0f0", band: "#d6336c", ink: "#2563eb", edge: "#0f3a99" },
  { bg: "#fff3bf", band: "#e0a100", ink: "#d6336c", edge: "#7d123c" },
  { bg: "#e6f7ff", band: "#1b84d9", ink: "#16a34a", edge: "#0b5a27" },
  { bg: "#f0e6ff", band: "#7048e8", ink: "#f59f00", edge: "#8a5a00" },
  { bg: "#ffe8e8", band: "#e8590c", ink: "#0d9488", edge: "#085a52" },
];

export const letterTheme = (i: number): LetterTheme => letterThemes[i % letterThemes.length];
