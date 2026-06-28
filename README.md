# KILO

**Jedna aplikacja fitness zamiast pięciu.** KILO łączy licznik kalorii, trening siłowy,
cardio z GPS, dietę i trenerów AI w jednym, dopracowanym ekosystemie (iOS / Android / PWA).

- 🎨 Marka i design system: [`BRANDBOOK.md`](./BRANDBOOK.md)
- 🗺️ Plan rozwoju: [`ROADMAP.md`](./ROADMAP.md)
- 🧠 Pamięć projektu (dla Claude Code): [`CLAUDE.md`](./CLAUDE.md)

## Funkcje

- **Dashboard** — kroki, makro (pierścienie), szybkie akcje, trenerzy AI, polecane przepisy.
- **Dieta** — cele kaloryczne, dziennik posiłków (trwały), nawodnienie, baza przepisów,
  lista zakupów oraz **skaner posiłków AI** (zdjęcie → rozpoznanie → makro).
- **Trening** — plany i sesje siłowe (serie, powtórzenia, timer przerw, objętość),
  cardio z GPS (dystans, czas), Atlas ćwiczeń, historia z poradami AI.
- **Profil** — Bio-Intelligence (realne wykresy siły i masy z danych), parametry, reset.
- **Trenerzy AI** — Kamil (siła), Marta (redukcja), Seba (motywacja) — napędzani Gemini.

## Stack

Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Framer Motion ·
React Router · TanStack Query · Firebase (Auth + Firestore) · Google Generative AI (Gemini) ·
Capacitor 8 (iOS/Android) · PWA.

## Szybki start

```sh
# 1. Zależności
npm install

# 2. Konfiguracja środowiska
cp .env.example .env
# uzupełnij VITE_GEMINI_API_KEY swoim kluczem z Google AI Studio
# (https://aistudio.google.com/app/apikey)

# 3. Tryb deweloperski
npm run dev
```

Bez `VITE_GEMINI_API_KEY` aplikacja działa, ale funkcje AI (trenerzy, skaner posiłków)
pokażą komunikat o braku konfiguracji.

## Skrypty

| Komenda | Opis |
|---|---|
| `npm run dev` | Serwer deweloperski (Vite) |
| `npm run build` | Build produkcyjny do `dist/` |
| `npm run preview` | Podgląd buildu |
| `npm run lint` | ESLint |

## Aplikacja natywna (Capacitor)

```sh
npm run build
npx cap sync
npx cap open ios     # lub: npx cap open android
```

## Bezpieczeństwo

- Sekrety trzymamy w `.env` (gitignored), nigdy w kodzie. Wzór: `.env.example`.
- Dostęp do bazy chroni [`firestore.rules`](./firestore.rules) — każdy użytkownik widzi
  tylko własne dane. Wdrożenie: `firebase deploy --only firestore:rules`.

## Struktura

```
src/
  pages/        Dashboard · Diet · Workout · Profile · Onboarding
  lib/          nutrition.ts (silnik kalorii) · user-store.ts · gemini.ts · health.ts · firebase.ts
  components/   KiloLogo.tsx · layout/ · ui/ (shadcn) · ProgressRing
  index.css     design tokens (Modern Noir + Elite Blue)
```
