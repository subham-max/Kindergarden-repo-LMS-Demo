// Admin-controlled settings, stored in localStorage for this demo.
// In the real app these come from your API / database.
export interface ExamSettings {
  durationMinutes: number;
  attempts: number;
  shuffle: boolean;
}

export const DEFAULT_EXAM: ExamSettings = { durationMinutes: 2, attempts: 3, shuffle: false };
const KEY = "portal.exam.settings";

export function loadExamSettings(): ExamSettings {
  if (typeof window === "undefined") return DEFAULT_EXAM;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULT_EXAM, ...JSON.parse(raw) } : DEFAULT_EXAM;
  } catch {
    return DEFAULT_EXAM;
  }
}

export function saveExamSettings(s: ExamSettings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}
