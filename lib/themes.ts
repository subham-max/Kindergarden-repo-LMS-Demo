// One look per learning module, so every module page and lesson page feels
// different (colour, background pattern, and lesson layout).
export interface ModuleTheme {
  bg: string; // page / stage background
  band: string; // bottom navigation band, borders
  ink: string; // big glyph / headline colour
  edge: string; // darker outline colour for the glyph
  pattern: string; // CSS background-image for the subtle texture
  size?: string; // background-size for the pattern
  layout: "split" | "center"; // lesson layout: side-by-side or centred
}

export const moduleThemes: Record<string, ModuleTheme> = {
  alphabet: {
    bg: "#efe3ff",
    band: "#7048e8",
    ink: "#7048e8",
    edge: "#3b1fa8",
    pattern: "radial-gradient(rgba(112,72,232,.14) 2px, transparent 2.5px)",
    size: "22px 22px",
    layout: "split",
  },
  numbers: {
    bg: "#d6f0ff",
    band: "#1b84d9",
    ink: "#ff7a3d",
    edge: "#a33d00",
    pattern: "repeating-linear-gradient(0deg, rgba(27,132,217,.10) 0 2px, transparent 2px 20px)",
    layout: "split",
  },
  animals: {
    bg: "#dff7d9",
    band: "#2f9e44",
    ink: "#e8590c",
    edge: "#9c3a05",
    pattern: "repeating-linear-gradient(45deg, rgba(47,158,68,.12) 0 14px, transparent 14px 28px)",
    layout: "split",
  },
  food: {
    bg: "#ffe7cf",
    band: "#e8590c",
    ink: "#2f9e44",
    edge: "#17702a",
    pattern: "radial-gradient(rgba(232,89,12,.16) 3px, transparent 3.5px)",
    size: "30px 30px",
    layout: "split",
  },
  festivals: {
    bg: "#f3e1ff",
    band: "#d6336c",
    ink: "#7048e8",
    edge: "#3b1fa8",
    pattern:
      "radial-gradient(rgba(214,51,108,.18) 4px, transparent 4.5px), radial-gradient(rgba(255,184,0,.22) 3px, transparent 3.5px)",
    size: "46px 46px, 31px 31px",
    layout: "center",
  },
  dress: {
    bg: "#fff1b8",
    band: "#d4a000",
    ink: "#d6336c",
    edge: "#7d123c",
    pattern: "repeating-linear-gradient(90deg, rgba(232,89,12,.14) 0 14px, rgba(214,51,108,.12) 14px 28px)",
    layout: "split",
  },
  dresscode: {
    bg: "#ffdcec",
    band: "#c2255c",
    ink: "#1b84d9",
    edge: "#0b5a99",
    pattern: "repeating-linear-gradient(135deg, rgba(194,37,92,.10) 0 10px, transparent 10px 20px)",
    layout: "center",
  },
};
