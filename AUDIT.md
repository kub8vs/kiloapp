# KILO — Brutalny audyt i lista TODO do poziomu world-class

> Ton: **bezlitosny**. Założenie: budujemy tak, jakby odbiorcą był Elon Musk —
> first-principles, prawdziwa integracja (nie atrapy), 10× lepiej niż konkurencja,
> teza „jedna apka zamiast pięciu" ma być **udowodniona**, nie zadeklarowana.

## Werdykt (szczerze)

**Gdzie jesteśmy: ~4/10 w drodze do „fitness OS".** Mamy świetnie wyglądający,
spójny, monochromatyczny **prototyp z poprawnym rdzeniem liczbowym** (silnik kalorii,
bilans energii MET/ACSM, typy 0×any, tryby, onboarding 18+ i subskrypcje). To dużo —
ale to wciąż **webview (Capacitor) na localStorage z zahardkodowaną treścią i atrapami
integracji**. Elon nie dałby szacunku za ładny UI. Da go za **prawdziwe dane, prawdziwą
integrację i 10× wygodę**. Do tego brakuje fundamentów wymienionych niżej.

---

## 🔴 TWARDE GRZECHY (fakty z kodu — naprawić u podstaw)

1. **Chmura jest fikcją (sync jednokierunkowy).** `getDoc` zaimportowany, ale nieużywany.
   Zapisujemy do Firestore, **nigdy nie czytamy**. Reinstalacja / nowy telefon = utrata
   wszystkich danych. „Sync w chmurze" w onboardingu to obietnica bez pokrycia.
2. **Brak realnego konta.** Domyślnie `signInAnonymously`; Google/Apple w onboardingu nie
   są powiązane z danymi (profil żyje w localStorage). Brak `onAuthStateChanged`, brak
   łączenia konta anon→stałe, brak sesji. Logowanie jest dekoracyjne.
3. **Zero testów.** Aplikacja liczy zdrowie ludzi (kcal, makro, deficyt) i **nie ma ani
   jednego testu**. Pierwszy refaktor = ruletka.
4. **Treść zahardkodowana.** 10 przepisów (zdjęcia Unsplash), ~30 ćwiczeń z **martwymi
   GIF-ami** (fallback to plaster, nie rozwiązanie). To demo z tablicami, nie „baza".
5. **Brak realnych danych zdrowotnych.** Kroki wpisywane ręcznie, zero HealthKit / Google
   Fit / Health Connect. Zegarki = „Wkrótce". Tętno = „brak danych". Czyli kluczowa
   obietnica „wszystko w jednym" jest pusta.
6. **AI = cienki wrapper.** Jedno wywołanie Gemini, klucz w kliencie, brak pamięci,
   brak generowania planów, brak adaptacji do danych. „Trener AI" to chatbot, nie trener.
7. **Licznik kalorii bez bazy produktów i skanera kodów.** Nie pobije MyFitnessPal bez
   bazy (np. Open Food Facts) i skanowania kodów kreskowych.
8. **Cardio nie jest klasy Strava.** Geolokalizacja w przeglądarce + iframe Google Maps.
   Brak zapisu trasy (polyline/GPX), tempa, przewyższeń, splitów.
9. **Wydajność.** Jeden bundle ~1.1 MB, brak code-splittingu/lazy, obrazy nieoptymalizowane.
10. **Latanie po ciemku.** Brak crash reportingu, analityki, lejka konwersji.
11. **Brak dowodu tezy „zastąp 5 apek".** Brak importu z Apple Health / Google Fit /
    MyFitnessPal / Strava i brak eksportu danych. Nie dajemy powodu, by porzucić tamte.
12. **Natywne blokery (z LAUNCH_CHECKLIST).** Brak uprawnień kamera/GPS w Info.plist /
    AndroidManifest → skaner i cardio crashują na urządzeniu.

---

## TODO — pełna lista (priorytetami)

### P0 — Fundament, którego brak boli najbardziej
- [ ] **Dwukierunkowy sync + realne konto.** `onAuthStateChanged`, odczyt z Firestore
      (`getDoc`/`onSnapshot`), łączenie anon→Google/Apple, hydracja stanu z chmury przy
      starcie, rozwiązywanie konfliktów (last-write-wins z timestampem na początek).
- [ ] **Backend (Cloud Functions).** Proxy do AI (klucz po stronie serwera), walidacja
      zapisów, serwer jako źródło prawdy dla wrażliwych danych, rate limiting.
- [ ] **Bezpieczeństwo:** rotacja klucza Gemini, wdrożenie `firestore.rules`, App Check.
- [ ] **Uprawnienia natywne** kamera/GPS (iOS Info.plist + AndroidManifest) + pluginy
      `@capacitor/camera`, `@capacitor/geolocation`.
- [ ] **Testy rdzenia:** Vitest dla `lib/nutrition.ts`, `lib/exercise-calories.ts`,
      `user-store` (sync). E2E Playwright dla onboardingu, logowania jedzenia, treningu.
- [ ] **CI** (GitHub Actions): lint + build + testy na każdy push.

### P1 — Rdzeń produktu: realne „wszystko w jednym"
- [ ] **Baza produktów + skaner kodów kreskowych** (Open Food Facts / USDA) — serce
      licznika kalorii. Skaner AI ze zdjęcia jako druga ścieżka.
- [ ] **Integracja zdrowia:** Apple HealthKit + Android Health Connect — kroki, tętno,
      sen, masa, treningi, spalone kcal. To czyni z KILO „hub", a nie kolejną apkę.
- [ ] **Cardio klasy Strava:** natywny zapis trasy (GPS polyline), tempo, splity,
      przewyższenia, mapa trasy, zapis/eksport GPX, historia z mapą.
- [ ] **Atlas ćwiczeń:** prawdziwa, kuratorowana biblioteka wideo + ustrukturyzowana baza
      (mięśnie, sprzęt, warianty, technika). Koniec z giphy.
- [ ] **Import „porzuć 5 apek":** import z Apple Health / Google Fit / (docelowo)
      MyFitnessPal / Strava + eksport własnych danych (CSV/GPX). Dowód tezy produktu.

### P2 — Inteligencja (prawdziwy trener, nie chatbot)
- [ ] **Generator planów AI:** tygodniowy plan treningowy i żywieniowy z profilu i celu,
      ze strukturą (sety/powt./progresja), aktualizowany na podstawie realnych logów.
- [ ] **Pętla adaptacji:** AI czyta historię (objętość, deficyt, masa) i koryguje cele
      i plan; „dlaczego" za każdą rekomendacją.
- [ ] **Pamięć trenera:** kontekst użytkownika utrzymywany między rozmowami.
- [ ] **Powiadomienia push** (FCM/APNs): proaktywne nudże trenera, przypomnienia,
      podsumowania — to, co reklamujemy, ma działać.
- [ ] Najnowsze modele (Claude/Gemini) ze **structured output** (JSON) zamiast parsowania tekstu.

### P3 — Jakość i zaufanie
- [ ] **Observability:** Sentry (crash) + analityka produktowa + lejek onboarding→subskrypcja.
- [ ] **Offline-first:** kolejka zapisów, działanie bez sieci, spójna synchronizacja po powrocie.
- [ ] **Wydajność:** lazy routes + `manualChunks`, initial bundle < 300 kB, optymalizacja
      obrazów (WebP/responsive), 60 fps na średnim telefonie.
- [ ] **Dostępność (a11y):** kontrast (mamy max-kontrast ✓), focus states, etykiety ARIA,
      obsługa czytników, rozmiary dotyku ≥ 44 px.
- [ ] **Stany brzegowe:** błędy sieci, puste stany, długie nazwy, ekstremalne liczby, RWD.

### P4 — Skala i biznes
- [ ] **Płatności:** RevenueCat / StoreKit / Google Play Billing pod plany, które już
      pokazujemy (free/PRO/ELITE), trial, paywall, restore purchases.
- [ ] **Retencja:** serie (streaks), cele tygodniowe, podsumowania, „social proof".
- [ ] **i18n:** architektura wielojęzyczna (start PL, gotowość na EN).
- [ ] **Onboarding konwersyjny:** personalizacja + „aha moment" w < 60 s.

### P5 — „WOW" (to, co realnie budzi szacunek)
- [ ] **Jeden ekran = pełny obraz dnia** (jedzenie + ruch + sen + bilans) — czego nie
      daje żadna pojedyncza apka.
- [ ] **AI „form check"** z wideo ćwiczenia (analiza techniki) — różnicownik 10×.
- [ ] **Auto-log:** zdjęcie talerza → makro w 2 s; zegarek → trening sam się zapisuje.
- [ ] **Predykcja:** „przy tym tempie osiągniesz cel X w dniu Y" na bazie realnych trendów.

---

## Co realnie da „szacunek Elona" (skup się na tym)

1. **Prawdziwa integracja zdrowia (HealthKit/Health Connect) + import z konkurencji.**
   Dopóki user musi wpisywać kroki ręcznie, to nie jest „OS". To jest must-have #1.
2. **Licznik z bazą + skanem kodów** — bez tego nie zastąpisz MyFitnessPal.
3. **AI, które realnie planuje i adaptuje** (pętla danych), nie chatbot.
4. **Backend + dwukierunkowy sync + konta** — dane muszą żyć poza jednym telefonem.
5. **Testy + observability** — dowód, że to inżynieria, nie demo.

> Zasada nadrzędna: **każda funkcja albo działa na prawdziwych danych, albo jej nie ma.**
> Żadnych atrap w wersji, którą pokazujesz światu.
