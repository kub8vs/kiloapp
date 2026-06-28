# KILO — Plan działania (Roadmap)

> Żywy plan rozwoju. Źródło prawdy o marce: [`BRANDBOOK.md`](./BRANDBOOK.md).
> Pamięć projektu: [`CLAUDE.md`](./CLAUDE.md). Status: `[ ]` do zrobienia · `[~]` w toku · `[x]` zrobione.

Strategia: **najpierw backend/logika (fundament danych), potem frontend (UI/spójność marki).**

---

## FAZA 1 — Backend / błędy logiczne (fundament) 🔴 ✅ ZROBIONE

Cel: dane, którym można ufać. Bez tego nie ma sensu budować UI.

- [x] **1.1 Silnik odżywiania (`lib/nutrition.ts`)** — jedno źródło prawdy
  - [x] Naprawić bug `activityLevel` (mnożnik vs indeks → NaN)
  - [x] Ujednolicić 3 wzory (Onboarding / Diet / user-store) w jeden
  - [x] `ACTIVITY_LEVELS`, `calculateBMR`, `calculateTDEE`, `calculateTargets`
  - [x] Repoint: `user-store.calculateDailyGoals`, `Onboarding`, `Diet`
- [x] **1.2 Model danych / typy**
  - [x] `UserProfile.activityLevel` → `number` (mnożnik), dodać `trainingStyle`, `experience`
  - [x] Usunąć `as any` w Onboarding
- [x] **1.3 Trwałość + wspólny stan dnia**
  - [x] `DailyLog` (posiłki + woda), `getDailyLog` / `saveDailyLog`
  - [x] `getTodayStats` liczone z logu → Dashboard widzi wpisaną dietę
  - [x] Trwała lista zakupów i kroki (store), usunąć martwe stuby
  - [x] Podłączyć `Diet.tsx` (load + save)
- [x] **1.4 Bezpieczeństwo / dane**
  - [x] Klucz Gemini → `VITE_GEMINI_API_KEY` (+ `.env.example`, gitignore `.env`)
  - [x] `firestore.rules` (dostęp tylko zalogowany użytkownik do swoich danych) + `firebase.json`
  - [ ] ⚠️ Ręcznie po stronie właściciela: **zrotować** stary klucz Gemini; docelowo proxy/Functions
- [x] **1.5 Weryfikacja** — `npm run build` ✓ (lint: tylko wcześniejsze błędy stylu `any`)
- [x] **Bonus:** usunięto `ngrok` z zależności (blokował instalację, dev-tool w prod)

---

## FAZA 2 — Frontend / spójność marki 🟡

Cel: jeden spójny system wizualny zgodny z brandbookiem.

- [ ] 2.1 Tokeny koloru: akcent (Elite Blue) jako zmienna CSS, koniec hardkodów `blue-600` po stronach
- [ ] 2.2 Kolory makro spójne: Dashboard = Diet (B niebieski / W zielony / T pomarańczowy)
- [ ] 2.3 `theme_color` w manifeście → `#000000`; ujednolicić splash/ikony
- [ ] 2.4 Docelowe logo (monogram KILO) zamiast `Zap`/`Dumbbell`
- [ ] 2.5 Przegląd typografii i odstępów wg brandbooka (sygnatura nagłówków)
- [ ] 2.6 Stany puste / ładowania / błędu — spójne komponenty
- [ ] 2.7 Sprzątanie: README (zamiast szablonu Lovable), usunąć `ngrok` z zależności, martwy `Index.tsx`

---

## FAZA 3 — „Prawdziwy produkt, nie demo” 🟠

Cel: realne dane zamiast atrap.

- [ ] 3.1 Kroki / zdrowie: HealthKit + Google Fit przez plugin Capacitor
- [ ] 3.2 Atlas ćwiczeń: realne media (martwe GIF-y do wymiany)
- [ ] 3.3 Skaner posiłków AI (kamera → rozpoznanie → makro) — feature „wow”
- [ ] 3.4 Profil „Bio-Intelligence”: realne wykresy z historii zamiast hardkodu
- [ ] 3.5 Integracje z zegarkami (Apple Watch / Samsung Health / Garmin)
- [ ] 3.6 Baza przepisów i produktów z prawdziwego źródła (zamiast tablicy w kodzie)

---

## FAZA 4 — Skalowanie i jakość

- [ ] 4.1 Testy (silnik odżywiania, store) + error boundaries
- [ ] 4.2 Onboarding kont / realna autoryzacja zamiast trybu anonimowego jako domyślnego
- [ ] 4.3 Powiadomienia push od trenerów AI
- [ ] 4.4 Optymalizacja wydajności i bundla, PWA offline

---

*Aktualizować statusy na bieżąco po każdej zrealizowanej pozycji.*
