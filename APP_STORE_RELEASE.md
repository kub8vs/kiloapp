# KILO — Lista zadań do publikacji w App Store

> Aktualne na teraz (po wszystkich zmianach w kodzie). Fokus: **Apple App Store**
> (większość dotyczy też Google Play — zaznaczam różnice). Legenda:
> **[TY]** = po stronie właściciela (konta/prawne/materiały) · **[KOD]** = mogę zrobić ja ·
> ⏱ szac. nakład.

## 0. Co już zrobione (nie dubluj)
- ✅ Uprawnienia natywne (Info.plist + AndroidManifest: kamera, lokalizacja, ruch)
- ✅ Bramka wieku 18+ w onboardingu
- ✅ Nazwa marki **KILO** + manifesty + podtytuł ASO
- ✅ `firestore.rules` w repo (deploy = niżej), klucz Gemini w ENV
- ✅ Testy (Vitest) + CI, build bez błędów, monochromia/tryby/Profil-centrum
- ✅ Ekran wyboru subskrypcji (UI) — ale BEZ realnej płatności (patrz §1)

---

## 1. 🔴 DWIE DECYZJE/BLOKERY DO PODJĘCIA NAJPIERW

### 1A. Subskrypcje a płatności (najczęstszy powód odrzucenia)
Apple **odrzuci** apkę, która pokazuje płatne plany (PRO/ELITE) bez działającego
**In-App Purchase (StoreKit)**. Masz dwie drogi:
- **Szybciej do v1:** w pierwszej wersji wszystko za darmo — ukryć ceny/paywall jako
  „kupno" (zostawić plany jako informację „wkrótce" lub usunąć). ⏱ [KOD] 0,5 dnia.
- **Pełna wersja:** wdrożyć IAP (StoreKit / RevenueCat) — trial, paywall, restore.
  ⏱ [KOD+TY] 2–4 dni + konfiguracja w App Store Connect.
> Rekomendacja: **v1 darmowe → IAP w v1.1.** Nie blokujesz premiery na płatnościach.

### 1B. Realne usuwanie konta (wymóg Apple 5.1.1(v))
Teraz „Usuń konto i dane" czyści tylko localStorage + wylogowuje. Apple wymaga
**realnego usunięcia konta** (Firebase Auth user + dokument w Firestore). ⏱ [KOD] 0,5 dnia.

---

## 2. Konto Apple + App Store Connect [TY] ⏱ 1–3 dni (weryfikacja)
- [ ] Apple Developer Program (99 USD/rok).
- [ ] App Store Connect: utwórz rekord aplikacji, przypnij Bundle ID `com.jakub.kilo`, SKU.
- [ ] Certyfikaty + provisioning (lub „Automatic signing" w Xcode z Twoim zespołem).
- [ ] (Play) Google Play Console (25 USD jednorazowo) — jeśli równolegle.

## 3. Build iOS
- [ ] **[KOD] Finalna ikona aplikacji** (AppIcon 1024×1024 bez alfy + komplet rozmiarów)
      z monogramem KILO. Teraz natywny launcher to wersja robocza — Apple odrzuca placeholder. ⏱ 0,5 dnia
- [ ] [KOD] Orientacja zablokowana na pionową (Info.plist wciąż dopuszcza poziom). ⏱ 10 min
- [ ] [KOD] Wersja + build number (`CFBundleShortVersionString` = 1.0.0, `CFBundleVersion` = 1).
- [ ] [KOD] Splash/launch screen dopięty do monochromii.
- [ ] [KOD] Native pluginy Capacitor: `@capacitor/camera`, `@capacitor/geolocation`
      (web `getUserMedia`/geolokacja w WKWebView bywa zawodna; Apple woli natywne). ⏱ 1 dzień
- [ ] [TY] `npm run build && npx cap sync ios` → otwórz w Xcode, ustaw zespół, capabilities.
- [ ] [KOD] Sprzątanie: `ngrok`/allowedHosts i `lovable-tagger` to dev-only — zostawić poza prod.

## 4. Wymogi wytycznych Apple
- [ ] **[KOD] Sign in with Apple** musi działać natywnie (masz Google → Apple jest WYMAGANE).
      W WKWebView popup bywa problematyczny → rozważyć `@capacitor-firebase/authentication`. ⏱ 1 dzień
- [ ] **[KOD] Usuwanie konta** (patrz §1B).
- [ ] **[TY] Polityka prywatności + Regulamin (EULA)** — publiczny URL (w apce są linki, podłącz treść).
- [ ] **[TY] App Privacy „nutrition labels"** w App Store Connect (zbierasz: dane konta przez
      Firebase, dane zdrowotne/dietetyczne — trzeba zadeklarować).
- [ ] **[TY] Age rating** — ustaw zgodnie z 18+ (kwestionariusz).
- [ ] **[KOD] Disclaimer zdrowotny** w apce (dieta/AI to nie porada medyczna) — dorobić ekran/sekcję.

## 5. Backend i bezpieczeństwo przed publiczną premierą
- [ ] **[TY] Zrotuj klucz Gemini** (stary jest w historii gita) + ustaw nowy.
- [ ] **[TY] Wdróż `firestore.rules` i `functions`:** `firebase deploy`. Bez tego baza jest
      otwarta, a proxy AI nie działa. (Szkielet `functions/` jest gotowy.)
- [ ] **[KOD] Przepnij AI na proxy** (`httpsCallable` zamiast klucza w kliencie) — po deployu.
- [ ] [TY] Dodaj iOS do projektu Firebase (logowanie Google/Apple natywne).
- [ ] [KOD] (opc.) App Check przeciw nadużyciom.

## 6. Materiały do listingu [TY] ⏱ 1 dzień
- [ ] Zrzuty ekranu: **6.7"** (iPhone 15 Pro Max) i **6.5"** (wymagane) — mogę wygenerować z buildu.
- [ ] Nazwa (≤30 zn.), podtytuł (≤30), opis, słowa kluczowe (≤100 zn.), URL wsparcia.
- [ ] Kategoria: **Zdrowie i fitness**. (Opc.) podgląd wideo.

## 7. Testy końcowe + wysyłka
- [ ] [TY] **TestFlight** — przejdź pełną ścieżkę na realnym iPhonie (onboarding → dieta →
      skaner → trening → cardio → profil → usuwanie konta). Zero crashy, zero placeholderów.
- [ ] [TY] Archive w Xcode → upload → uzupełnij metadane/prywatność/cennik → **Submit for Review**.
- [ ] [TY] Odpowiedz na ewentualne uwagi recenzenta.

---

## Co mogę zrobić od ręki w kodzie (gdy dasz zielone)
1. Realne usuwanie konta (Auth + Firestore).
2. Decyzja 1A: tryb „v1 darmowe" (ukrycie paywalla) **lub** wpięcie RevenueCat.
3. Finalna ikona + splash + blokada orientacji + wersjonowanie.
4. Native pluginy Capacitor (camera/geolocation) + przepięcie AI na proxy.
5. Ekran disclaimeru zdrowotnego + podpięcie treści polityki/regulaminu.

## Realny czas do „gotowe do Submit"
~**1–2 tygodnie pracy w kodzie** (powyższe) + Twoja część (konta, treści prawne, materiały,
TestFlight). Płatności IAP dodają 2–4 dni, jeśli wchcesz je w v1.
