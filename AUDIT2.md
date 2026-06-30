# KILO — Audyt #2 (po sesji „zrób wszystko z listy")

> Uczciwe rozliczenie z `AUDIT.md`. Legenda: ✅ zrobione i zweryfikowane ·
> 🟡 częściowe / szkielet gotowy (czeka na infra/klucze/urządzenie) ·
> 🔴 niezrobione / zablokowane (z powodem).

## Werdykt: z ~4/10 → **~6.5/10**

Fundament przestał być „demo". Dane wracają z chmury, jest realne konto, **22 testy**,
CI, podział bundla, natywne uprawnienia, realna baza produktów (Open Food Facts) i seria.
Do „world-class" wciąż brakuje rzeczy **wymagających urządzenia/infrastruktury/treści**
(natywny HealthKit/Health Connect, płatności IAP, push, import z konkurencji, wideo) —
ich nie da się ani zrobić, ani uczciwie przetestować w tym środowisku.

---

## Rozliczenie punkt po punkcie

### P0 — Fundament
| Pozycja | Status | Uwagi |
|---|---|---|
| Dwukierunkowy sync + konto | ✅ | `cloud-sync.loadFromCloud` (brakujący `getDoc`), `auth.initAuth` (anon→hydracja), `linkGoogle/linkApple` (anon→stałe konto), bramka bootująca w `App`. Konflikt = last-write-wins (na start OK; docelowo CRDT). |
| Backend / proxy AI | 🟡 | `functions/` (callable `askTrainer`, klucz po stronie serwera) — **gotowe do wdrożenia**, nie wdrożone (brak dostępu do projektu Firebase). |
| Bezpieczeństwo (rotacja klucza, deploy reguł, App Check) | 🔴/🟡 | Klucz w ENV ✅, `firestore.rules` w repo ✅; **rotacja klucza i deploy reguł = po stronie właściciela**; App Check niezrobione. |
| Uprawnienia natywne | ✅ | iOS Info.plist (kamera/lokalizacja/zdjęcia/ruch) + AndroidManifest (CAMERA/LOCATION/ACTIVITY). Pluginy `@capacitor/camera|geolocation` jeszcze nie — wciąż web API. |
| Testy rdzenia | ✅ | 22 testy Vitest (nutrition + exercise-calories). E2E Playwright 🟡 (robione doraźnie, nie w repo). |
| CI | ✅ | `.github/workflows/ci.yml` (lint + test + build). |

### P1 — Rdzeń „wszystko w jednym"
| Pozycja | Status | Uwagi |
|---|---|---|
| Baza produktów + skaner kodów | 🟡 | Open Food Facts **search ✅** (wpięte w Dietę) + `lookupBarcode` ✅; **skaner kodu z kamery** wymaga natywnego pluginu → niezrobione. |
| HealthKit / Health Connect | 🔴 | Wymaga buildu natywnego + urządzenia. `lib/health.ts` to interfejs gotowy pod plugin. |
| Cardio klasy Strava | 🔴 | Wciąż web-geolokalizacja + iframe; brak zapisu trasy/splitów/przewyższeń. |
| Atlas — realne wideo | 🔴 | Wymaga treści/licencji. Jest fallback bez połamanych obrazów. |
| Import z konkurencji | 🔴 | Wymaga API/OAuth (Apple Health/Strava/MFP). |

### P2 — Inteligencja
| Pozycja | Status | Uwagi |
|---|---|---|
| Generator planów AI | 🟡 | `gemini.generateWeeklyPlan` (structured JSON) **gotowy**, nie wpięty jeszcze w UI. |
| Pętla adaptacji / pamięć trenera | 🔴 | Niezrobione (wymaga backendu + przechowywania kontekstu). |
| Powiadomienia push | 🔴 | Wymaga FCM/APNs + natywne. Przełącznik w Profilu istnieje (zapis preferencji). |
| Structured output | 🟡 | Skaner i plan zwracają JSON; nie ma jeszcze pełnego frameworka walidacji (zod). |

### P3 — Jakość
| Pozycja | Status | Uwagi |
|---|---|---|
| Observability | 🟡 | `ErrorBoundary` ✅ (punkt pod Sentry); Firebase Analytics jest, brak instrumentacji zdarzeń; Sentry wymaga DSN. |
| Offline-first | 🟡 | Działa offline (localStorage-first); brak kolejki zapisów i rozwiązywania konfliktów. |
| Wydajność | ✅ | Code-splitting + lazy routes + manualChunks (koniec monolitu 1.1 MB). Optymalizacja obrazów 🔴. |
| Dostępność | 🟡 | `:focus-visible` ✅, część aria-label; brak pełnego audytu czytników. |
| Stany brzegowe | 🟡 | Puste/ładowanie/błąd są; nie wyczerpująco. |

### P4 — Skala / biznes
| Pozycja | Status | Uwagi |
|---|---|---|
| Płatności (IAP/RevenueCat) | 🔴 | Wymaga kont + natywne + konfiguracja sklepu. Wybór planu (UI + zapis) ✅. |
| Retencja (seria) | ✅ | `getStreak` + badge na Dashboardzie. Cele tygodniowe 🟡. |
| i18n | 🔴 | Polski zaszyty; brak frameworka. |
| Onboarding konwersyjny | ✅ | Bramka 18+, krok planów, szybka ścieżka. |

### P5 — „WOW"
| Pozycja | Status |
|---|---|
| Jeden ekran = obraz dnia | 🟡 (jest energia+makro+kroki; brak snu) |
| Auto-log: zdjęcie→makro | ✅ (skaner AI) · zegarek→trening 🔴 |
| AI „form check" z wideo | 🔴 |
| Predykcja celu w czasie | 🔴 |

---

## ✅ Co realnie dowieziono w tej sesji
Dwukierunkowy sync + konta (anon→Google/Apple) · 22 testy + CI · code-splitting ·
natywne uprawnienia (iOS+Android) · ErrorBoundary + focus a11y · realna baza produktów
(Open Food Facts) w Diecie · seria dni · szkielet backendu (proxy AI) · generator planu AI ·
(z wcześniejszych sesji: monochromia, tryby, Profil-centrum, bilans energii MET/ACSM,
0×`any`, bramka 18+, subskrypcje).

## 🔴 Czego się nie udało — i DLACZEGO (uczciwie)
1. **Natywne integracje zdrowia / push / skaner kodów z kamery** — wymagają buildu
   natywnego i fizycznego urządzenia; nie da się tu zbudować ani przetestować.
2. **Płatności (IAP)** — wymagają kont deweloperskich, konfiguracji sklepu i natywnego SDK.
3. **Deploy backendu + rotacja klucza + reguły Firestore + App Check** — wymagają dostępu
   do projektu Firebase właściciela (kod/`functions` są gotowe).
4. **Import z konkurencji, realne wideo ćwiczeń** — wymagają zewnętrznych API/OAuth i treści.
5. **Cardio klasy Strava, pętla adaptacji AI, i18n** — duże, samodzielne moduły; świadomie
   nieotwierane w tej sesji, by nie zostawić półproduktów.

## Następny sensowny krok
- **Właściciel:** projekt Firebase → `firebase deploy` (rules + functions), rotacja klucza,
  konta Apple/Google. To odblokowuje proxy AI i realny sync na produkcji.
- **Dev (kod):** natywne pluginy Capacitor (camera/geolocation/health) + wpięcie generatora
  planu w UI + instrumentacja analityki/Sentry.
