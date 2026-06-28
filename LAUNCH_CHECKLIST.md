# KILO — Rozpiska do publikacji (App Store + Google Play)

> Stan na teraz: **fundament/logika gotowe** (silnik kalorii, bilans energii, typy 0×`any`,
> trwałość, reguły Firestore w repo). Poniżej WSZYSTKO, co dzieli appkę od bycia w 100%
> gotową do sklepów. Legenda: **[KOD]** = mogę zrobić ja · **[TY]** = po Twojej stronie
> (konta, prawne, materiały) · ⏱ szacowany nakład.

---

## A. TWARDE BLOCKERY — bez tego sklep odrzuci albo appka się wywali 🔴

- [ ] **[KOD] Uprawnienia natywne — kamera + lokalizacja.** ⏱ 30 min
  - iOS `Info.plist`: `NSCameraUsageDescription`, `NSLocationWhenInUseUsageDescription`
    (skaner + cardio inaczej **crashują** na iPhone i są odrzucane).
  - Android `AndroidManifest.xml`: `CAMERA`, `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`
    + obsługa zgód runtime (Capacitor).
- [ ] **[KOD] Skaner i GPS na natywnym API.** ⏱ 0,5–1 dzień
  - Web `getUserMedia`/`navigator.geolocation` bywa zawodne w WKWebView — przejść na
    pluginy `@capacitor/camera` i `@capacitor/geolocation` (stabilność + poprawne zgody).
- [ ] **[TY] Zrotować klucz Gemini** (stary jest w historii gita = spalony) i ustawić
    `VITE_GEMINI_API_KEY`. ⏱ 10 min
- [ ] **[KOD+TY] Wynieść AI z klienta na proxy** (Firebase Cloud Function). ⏱ 1 dzień
  - Inaczej każdy wyciągnie klucz z apki i wygeneruje koszty na Twój rachunek. Apple/Google
    tego nie sprawdzą, ale to realne ryzyko finansowe po reklamach.
- [ ] **[TY] Wdrożyć reguły Firestore** `firebase deploy --only firestore:rules`. ⏱ 5 min
- [ ] **[KOD] Usuwanie konta w aplikacji** (wymóg Apple dla appek z logowaniem). ⏱ 0,5 dnia
- [ ] **[TY] Konta deweloperskie:** Apple Developer (99 $/rok) + Google Play (25 $ jednorazowo). ⏱ 1–2 dni (weryfikacja)
- [ ] **[TY] Polityka prywatności + Regulamin** (publiczny URL). ⏱ 0,5 dnia
  - Wymagane bo: Firebase (dane), kamera, lokalizacja, AI. Plus formularze:
    Apple „Privacy Nutrition Labels" i Google „Data Safety".
- [ ] **[KOD] Disclaimer zdrowotny** (treści fitness/dieta i AI to nie porada medyczna). ⏱ 1 h

---

## B. WYMAGANE DO WYSŁANIA BUILDU 🟠

- [ ] **[KOD] Finalna ikona aplikacji** (1024×1024) + komplet rozmiarów + splash z monogramem KILO
  (teraz natywny launcher to wersja robocza). ⏱ 0,5 dnia (mam już znak `KiloLogo`)
- [ ] **[KOD] Orientacja pionowa** wymuszona też w iOS `Info.plist` (teraz dopuszcza poziom). ⏱ 10 min
- [ ] **[KOD] Wersjonowanie** (`versionName`/`versionCode`, `MARKETING_VERSION`, package.json). ⏱ 10 min
- [ ] **[TY] Podpisywanie buildów:** iOS (certyfikaty + provisioning w Xcode), Android (keystore .jks). ⏱ 0,5 dnia
- [ ] **[TY] Materiały do listingu:**
  - Zrzuty ekranu na wymagane rozmiary (iPhone 6.7"/6.5", iPad jeśli wspierasz; telefon Android).
  - Nazwa, podtytuł, opis, słowa kluczowe, kategoria (Zdrowie i fitness), wiek (rating).
  - Ikona marketingowa 512 (Google), grafika promocyjna.
- [ ] **[TY] Test na realnym urządzeniu:** TestFlight (iOS) + Play „Testy wewnętrzne" (Android).
  Przejść pełną ścieżkę: onboarding → dieta → skaner → trening → cardio → profil. ⏱ 2–3 dni

---

## C. SILNIE ZALECANE — żeby nie zbierać 1-gwiazdkowych opinii 🟡

- [ ] **[KOD] Crash reporting + analytyka** (Sentry/Crashlytics + zdarzenia). ⏱ 0,5 dnia
- [ ] **[KOD] Testy silnika** `lib/nutrition.ts` i `lib/exercise-calories.ts` (Vitest). ⏱ 0,5 dnia
- [ ] **[KOD] Stany offline / błędu / brak internetu** — spójne komunikaty. ⏱ 0,5 dnia
- [ ] **[KOD] Realne kroki:** HealthKit (iOS) + Health Connect/Google Fit (Android) zamiast wpisu ręcznego. ⏱ 1–2 dni
- [ ] **[KOD] Powiadomienia push trenerów AI** (FCM/APNs + `google-services.json` + plugin). ⏱ 1 dzień
  - Uwaga: jeśli reklamujesz „trener AI wysyła powiadomienia", to musi działać przed reklamą.
- [ ] **[KOD] Atlas — realne wideo/animacje ćwiczeń** (teraz placeholder). ⏱ zależy od źródła mediów
- [ ] **[KOD] Zewnętrzna baza produktów** (np. Open Food Facts) pod skaner/wyszukiwarkę. ⏱ 1 dzień

---

## D. PO STARCIE (v1.1+) 🟢

- [ ] Parowanie zegarków (Apple Watch / Garmin / Samsung) — realne BLE/health.
- [ ] Plany treningowe generowane przez AI, progresja, statystyki long-term.
- [ ] Subskrypcja „KILO ELITE" (RevenueCat) jeśli model płatny.
- [ ] Lokalizacje językowe (jeśli wyjście poza PL).

---

## Podział: co robię ja vs co Ty

**Mogę zrobić w kodzie (większość blockerów A i B-kod, całe C-kod):** uprawnienia, pluginy
kamera/GPS, usuwanie konta, disclaimer, ikona/splash, wersjonowanie, proxy AI, testy,
crash reporting, push, HealthKit/Health Connect, baza produktów.

**Tylko Ty (poza kodem):** konta deweloperskie, zrotowanie klucza + env, deploy reguł,
polityka prywatności (hosting), podpisywanie certyfikatami, zrzuty ekranu, opisy w sklepie,
wysyłka formularzy prywatności, nagrania/reklamy.

---

## Realny harmonogram (szac.)

- **Minimum do pierwszego buildu na TestFlight/Play (blockery A + B-kod):** ~1 tydzień pracy w kodzie.
- **Pełna gotowość do publicznej publikacji (A+B+C-najważniejsze):** ~3–4 tygodnie
  (w tym Twoje: konta, materiały, testy na urządzeniu, formularze).
