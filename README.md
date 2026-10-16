# Learn & Play — Trilingual Learning Portal (frontend demo)

Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion. All data is dummy data.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

## What's inside

| Route | What it does |
|---|---|
| `/` | Hub: big bouncy tiles for every section |
| `/learn/{module}` (`alphabet`, `numbers`, `animals`, `food`, `festivals`, `dress`, `dresscode`) | Module page: a grid of tiles, each module with its own colours and pattern |
| `/learn/{module}/{item}` | Full-screen lesson page for one item (no popup). Steps: the letter, then word + picture, then all 3 languages + video. Arrow buttons or the arrow keys move between steps and items, Esc closes. Alphabet, numbers and the culture modules each use their own lesson layout |
| `/learn/dress` | Traditional Dress is a dress-up studio, not a grid + lesson pages: tap a garment to put it on the figure (tap it on the figure to take it off), with its name in all 3 languages, audio and a video slot. `components/DressStudio.tsx`; the figure and garments are original SVG drawings you can replace with real artwork |
| `/poems` | 4-line poems with line-by-line read-along highlighting |
| `/typing` | Typing speed test (WPM + accuracy), per language |
| `/exam` | Timed quiz; duration comes from the admin setting |
| `/game` | Picture/word matching card-flip game |
| `/drag` | GSAP Draggable game: drag each picture onto its name (snap, bounce, shake on wrong) |
| `/admin` | Set exam duration/attempts, and a poem editor that enforces the 4-line limit |

## Animation split

- **GSAP** (`gsap`, `@gsap/react`): hub intro timeline, word-by-word poem highlight, drag game. Always used through `useGSAP`, and skipped or shortened when the user prefers reduced motion.
- **Framer Motion**: hover/tap, popups, language pill, card flips. Never animate the same element with both libraries.

## Where to change things

- `lib/data.ts` — all content. Set `TRIBAL_NAME` to Galo / Nyishi / Adi. Replace every `⟨T⟩` placeholder with reviewed text from native speakers.
- `lib/audio.ts` — plays a real file when one exists, otherwise falls back to browser speech (English and Hindi only). Tribal languages need recorded audio.
- Audio files: `public/media/audio/{lang}/{id}.mp3` and set the `audio` field on an item (`{lang}` is replaced by en / hi / tr).
- Video files: `public/media/video/{id}.mp4` and set the `video` field on an item.
- `lib/settings.ts` — exam settings are in localStorage for the demo; replace with API calls.

## Before going live

- The exam timer here runs in the browser. In production the server must store `expiresAt` and reject late answers.
- Protect `/admin` with login and roles.
- Hindi typing: add an on-screen InScript keyboard for users without a Hindi keyboard.
- Use original poems, or traditional/public-domain ones, and recorded media you own.
