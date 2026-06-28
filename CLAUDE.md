# CLAUDE.md — pamięć projektu KILO

> Ten plik jest automatycznie ładowany w każdej sesji. To operacyjna pamięć projektu.
> **Pełne źródło prawdy o marce i designie: [`BRANDBOOK.md`](./BRANDBOOK.md).**

## Czym jest KILO

Mobilna aplikacja fitness **„wszystko w jednym”** — ma zlikwidować chaos wielu osobnych
apek (licznik kalorii, trening siłowy, cardio z GPS, dieta, trener AI) i połączyć je
w jeden inteligentny system. Cel produktowy: **„rozwalić system”** — być domyślnym
systemem operacyjnym osoby aktywnej.

Język produktu: **polski**. Platformy: **iOS, Android, PWA**.

## Zasady marki (nienegocjowalne — szczegóły w BRANDBOOK.md)

- **Dark-first.** Czarne tło (`#000000`) dominuje. Nie wprowadzać jasnego motywu jako głównego.
- **Kolor system: „Modern Noir + Elite Blue”.** Monochromatyczny fundament + JEDEN
  kolor-bohater: **Elite Blue `#2563EB`**. Reszta kolorów = wyłącznie funkcja:
  zielony `#10B981` (sukces/cardio), pomarańczowy `#F97316` (spalanie/tłuszcz),
  czerwony `#DC2626` (stop/błąd).
- **Makro (standard docelowy):** Białko = niebieski, Węgle = zielony, Tłuszcze = pomarańczowy.
- **Typografia-sygnatura:** nagłówki = `font-black` + `UPPERCASE` + `italic` + `tracking-tighter`.
  Krój systemowy (`-apple-system…`).
- **Kształt:** bardzo duże zaokrąglenia (squircle), bazowy `--radius: 1.5rem`, karty do `3rem`.
- **Ikony:** wyłącznie **Lucide** (liniowe, 24px).
- **Ruch:** Framer Motion, sprężysty i celowy; feedback dotykowy (`active:scale-95`) na wszystkim.
- **Ton:** pewny, konkretny, techniczno-premium („Elite”), zwięzły. Bez infantylizmu.
- **Naming:** marka **KILO** · aplikacja **Kilo** · linia premium **KILO ELITE**.

## Stack i architektura

- **Frontend:** Vite + React 18 + TypeScript
- **UI:** Tailwind + shadcn/ui (Radix) + lucide-react + Framer Motion
- **Routing:** React Router · **Server state:** TanStack Query
- **Backend:** Firebase (Auth: Google/Apple/anon, Firestore, Analytics)
- **AI:** Google Generative AI — Gemini 1.5 Flash (`src/lib/gemini.ts`)
- **Natywnie:** Capacitor 8 (`com.jakub.kilo`) + PWA (vite-plugin-pwa)
- **Storage:** localStorage + sync do Firestore (`src/lib/user-store.ts`)
- Build/run: `npm run dev`, `npm run build`, `npm run lint`. Pakiety przez **bun** (bun.lockb).

### Mapa plików
```
src/
  pages/        Onboarding · Dashboard · Diet · Workout · Profile · NotFound · Index(martwy)
  lib/          firebase.ts · gemini.ts · user-store.ts (model danych + sync) · utils.ts
  components/
    layout/     AppLayout.tsx · BottomNavigation.tsx (4 zakładki)
    ui/         shadcn + ProgressRing.tsx (sygnaturowy pierścień)
  index.css     design tokens (Modern Noir)
tailwind.config.ts  · capacitor.config.ts · src/pages/manifest.json (PWA)
```

## ⚠️ Znane problemy / backlog (kolejność wg priorytetu)

> **STATUS (aktualny):** P0 (bezpieczeństwo, silnik kalorii, trwałość) ✅ zrobione.
> P1 (skaner AI, realne wykresy, kroki, atlas-fallback) ✅ w większości zrobione.
> P2 (tokeny koloru, makro, theme_color, logo) ✅ zrobione. Dodatkowo: usunięto
> WSZYSTKIE `any` (lint 0 błędów), działa tryb jasny/ciemny, bilans energii
> (spalone kcal → budżet dnia, MET/ACSM). Pełny, aktualny plan: **[`ROADMAP.md`](./ROADMAP.md)**.
> Pozostało (wymaga urządzenia/zasobów): natywne HealthKit/Google Fit, parowanie
> zegarków, kuratorowane wideo ćwiczeń, zewnętrzna baza produktów; oraz testy (FAZA 4).
> ⚠️ Ręcznie u właściciela: zrotować klucz Gemini, ustawić `VITE_GEMINI_API_KEY`,
> wdrożyć `firestore.rules`.

### P0 — Fundament (zrobić ZANIM dobudujemy funkcje)
1. **Bezpieczeństwo:** klucz Gemini zaszyty w kliencie (`src/lib/gemini.ts`) → przenieść
   wywołania AI na backend/proxy (np. Firebase Functions) i **zrotować klucz**.
   Brak reguł Firestore w repo → dodać i zablokować (`firestore.rules`, auth-only).
2. **Silnik kalorii (bug + 3 źródła prawdy):** `UserProfile.activityLevel` deklaruje
   `1|2|3|4|5`, a zapisywane są mnożniki (1.2/1.375/1.55/1.725). `calculateDailyGoals`
   liczy `multipliers[activityLevel-1]` → NaN. Onboarding, Diet i user-store mają TRZY
   różne wzory. → Ujednolicić w JEDEN moduł `lib/nutrition.ts` (BMR→TDEE→cele), naprawić typy.
3. **Trwałość + jedno źródło stanu dnia:** dziennik diety (`meals`), woda, lista zakupów
   to `useState` → znikają po reload i nie trafiają na Dashboard. → Zapisywać przez
   `saveDailyStats`/store, by Diet i Dashboard współdzieliły dane.

### P1 — „Prawdziwy produkt, nie demo”
4. **Kroki/zdrowie:** licznik kroków zawsze 0 (brak integracji). → HealthKit / Google Fit
   przez plugin Capacitor, albo uczciwie ukryć do czasu integracji.
5. **Atlas ćwiczeń:** część GIF-ów to martwe URL-e (np. `…v96v9v6v9v6v…`). → realne media.
6. **Skaner posiłków:** zakładka „scanner” + kamera są, ale brak realnej analizy AI. → dokończyć.
7. **Profil „Bio-Intelligence”:** wykresy (siła/tętno/masa) i integracje z zegarkami są
   zahardkodowane/atrapy. → podłączyć realne dane lub oznaczyć jako „wkrótce”.

### P2 — Spójność marki (z BRANDBOOK §17)
8. Ujednolicić tokeny koloru (akcent niebieski jako zmienna CSS, nie hardkod po stronach).
9. Kolory makro spójne Dashboard = Diet.
10. `theme_color` w manifeście → `#000000` (teraz `#0ea5e9`/biały, kłóci się z html).
11. Podmienić logo zastępcze (Zap/Dumbbell) na docelowy monogram KILO.
12. README to wciąż szablon Lovable; `ngrok` jako zależność produkcyjna — usunąć.

## Konwencje pracy

- Rozwój na branchu `claude/lucid-johnson-1t2taq`. PR tylko na wyraźną prośbę.
- UI i komunikaty po polsku; terminy markowe (Elite, Pro, Atlas, GPS Live) dozwolone.
- Każda nowa funkcja musi być zgodna z BRANDBOOK.md (kolor, typografia, kształt, ruch, ton).
- Nie commitować sekretów. Sekrety przez zmienne środowiskowe / backend.
