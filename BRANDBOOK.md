# KILO — Brandbook

> **Jedna aplikacja zamiast pięciu.** Licznik kalorii, trening siłowy, cardio z GPS,
> dieta i trener AI — w jednym, dopracowanym ekosystemie fitness.

Wersja dokumentu: 1.0 · Język produktu: polski · Platformy: iOS, Android, PWA

---

## Spis treści

1. [Esencja marki](#1-esencja-marki)
2. [Pozycjonowanie i grupa docelowa](#2-pozycjonowanie-i-grupa-docelowa)
3. [Architektura nazwy (naming)](#3-architektura-nazwy-naming)
4. [Osobowość marki i ton komunikacji](#4-osobowość-marki-i-ton-komunikacji)
5. [Logo i znak](#5-logo-i-znak)
6. [Kolory](#6-kolory)
7. [Typografia](#7-typografia)
8. [Kształty, przestrzeń i zaokrąglenia](#8-kształty-przestrzeń-i-zaokrąglenia)
9. [Efekty: glassmorfizm, poświata, gradienty](#9-efekty-glassmorfizm-poświata-gradienty)
10. [Ikonografia](#10-ikonografia)
11. [Ruch i animacja](#11-ruch-i-animacja)
12. [Fotografia i obrazy](#12-fotografia-i-obrazy)
13. [Komponenty UI](#13-komponenty-ui)
14. [Trenerzy AI — bohaterowie marki](#14-trenerzy-ai--bohaterowie-marki)
15. [Mikrokopia i słownik „Elite”](#15-mikrokopia-i-słownik-elite)
16. [Zasady spójności (Do & Don't)](#16-zasady-spójności-do--dont)
17. [Wykryte niespójności i rekomendacje](#17-wykryte-niespójności-i-rekomendacje)
18. [Aneks: stack technologiczny i mapa funkcji](#18-aneks-stack-technologiczny-i-mapa-funkcji)

---

## 1. Esencja marki

### Problem, który rozwiązujemy
Świat fitness jest rozbity na kilkanaście osobnych aplikacji: jedna liczy kalorie,
druga nagrywa bieganie, trzecia prowadzi trening siłowy, czwarta podpowiada dietę,
piąta to chatbot-trener. Użytkownik płaci za kilka subskrypcji, przełącza się między
ekosystemami i nigdzie nie ma pełnego obrazu swoich postępów.

### Nasza odpowiedź
**KILO** łączy wszystko w jednym miejscu:

- **Licznik kalorii i makro** (białko / węgle / tłuszcze)
- **Trening siłowy** (plany, aktywna sesja, serie/powtórzenia, timer przerw, objętość)
- **Cardio z GPS** (dystans liczony wzorem Haversine, mapa na żywo, czas)
- **Dieta** (baza przepisów, dziennik posiłków, nawodnienie, lista zakupów)
- **Trenerzy AI** (Kamil, Marta, Seba — odpowiadają i prowadzą użytkownika)
- **Bio-Intelligence** (analiza siły, tętna spoczynkowego, trendu masy ciała)

### Misja
> Zlikwidować chaos wielu aplikacji fitnessowych i dać każdemu **jeden inteligentny
> system**, który prowadzi od pomiaru, przez trening i dietę, aż po realny progres.

### Wizja
Stać się domyślnym „systemem operacyjnym” dla osoby aktywnej — miejscem, w którym
zaczyna się i kończy każdy dzień treningowy.

### Wartości marki
| Wartość | Co oznacza w praktyce |
|---|---|
| **Jedność** | Wszystko w jednym miejscu. Zero przełączania się między aplikacjami. |
| **Precyzja** | Liczby, makro, objętość, dystans — dane, nie ogólniki. |
| **Inteligencja** | AI i analityka, które tłumaczą dane na konkretne rekomendacje. |
| **Performance** | Estetyka i język klasy „elite” — motywują, nie infantylizują. |
| **Klarowność** | Ciemny, czysty interfejs. Treść ważniejsza niż dekoracja. |

### Propozycja wartości (jedno zdanie)
> **KILO to jedna aplikacja, która łączy licznik kalorii, trening, cardio, dietę
> i trenera AI — żebyś przestał żonglować pięcioma apkami i zaczął robić progres.**

---

## 2. Pozycjonowanie i grupa docelowa

### Pozycjonowanie
Premium, „performance-grade”, ciemny i techniczny — bliżej estetyki sprzętu sportowego
i interfejsów pokładowych niż kolorowych, „przyjaznych” aplikacji wellness.
Nie jesteśmy zabawką do liczenia kroków — jesteśmy **systemem treningowym**.

### Persony

**1. „Świadomy samodzielny” — Kuba, 19–30 lat**
Trenuje na siłowni lub w domu (kalistenika), liczy makro, chce mieć wszystko pod kontrolą
w telefonie. Zmęczony płaceniem za 3 subskrypcje. Ceni czysty, „poważny” wygląd.

**2. „Wracający do formy” — 25–40 lat**
Redukcja lub rekompozycja. Potrzebuje prowadzenia za rękę: gotowych przepisów, jasnych
celów kalorycznych i trenera, który podpowie następny krok.

**3. „Data-driven” — 25–45 lat**
Kocha wykresy, trendy, objętość treningową, integrację z zegarkiem. Chce widzieć
postęp w liczbach i analizach „Bio-Intelligence”.

### Ton wobec użytkownika
Mówimy do użytkownika jak do **zawodnika** („Mistrz”, „Kilo Elite Member”), nie jak do
pacjenta. Motywujemy przez kompetencję i konkret, nie przez infantylne emoji-cheerleading.

---

## 3. Architektura nazwy (naming)

W kodzie marka występuje obecnie w kilku wariantach. Ujednolicamy je tak:

| Kontekst | Forma poprawna | Uwagi |
|---|---|---|
| **Marka / produkt** | **KILO** | Główna nazwa. Wersaliki w warstwie wizualnej. |
| **Nazwa aplikacji (store/ikona)** | **Kilo** | `appName`, `app_name`, splash. |
| **Domena techniczna / package** | `com.jakub.kilo` | iOS/Android appId. |
| **Linia premium / claim** | **KILO ELITE** | Sub-brand, hasło, ekran powitalny, persona AI. |
| **PWA / web** | **KiloApp** | Dozwolone jako forma webowa; docelowo dążyć do „Kilo”. |

**Tagline’y (do użycia):**
- „System Inteligentnego Treningu” (formalny, techniczny)
- „Twój Trener AI” (prosty, marketingowy)
- „Jedna aplikacja zamiast pięciu” (problem/benefit)

**Zasada:** „ELITE” to przymiotnik premium, nie nowa marka. Zawsze obok „KILO”
(„KILO ELITE”), nigdy samodzielnie jako nazwa produktu.

---

## 4. Osobowość marki i ton komunikacji

### Archetyp
**Bohater + Mędrzec.** Popycha do działania (Bohater) i tłumaczy dane oraz technikę
(Mędrzec). Trener z najwyższej półki, który wie, o czym mówi.

### Cechy głosu
- **Pewny siebie**, nigdy arogancki.
- **Konkretny** — liczby, jednostki, mierzalne rekomendacje.
- **Zwięzły** — krótkie zdania, tryb rozkazujący w CTA („Generuj Plan”, „Start Cardio”).
- **Techniczno-premium** — słownictwo „Elite / System / Neural / Bio-Intelligence”.
- **Motywujący przez kompetencję**, nie przez krzyk.

### Jak piszemy
| Element | Zasada | Przykład |
|---|---|---|
| Nagłówki | Wersaliki, mocne, krótkie | `TWÓJ CEL`, `BIOMETRIA`, `ELITE PRO` |
| CTA / przyciski | Tryb rozkazujący | „Dalej”, „Generuj Plan”, „Zakończ i Zapisz” |
| Etykiety | Krótkie, techniczne, wersaliki | „ZOSTAŁO ENERGII”, „GPS LIVE”, „DYSTANS KM” |
| Porady AI | Rzeczowe, max 2–3 zdania, praktyczne | „Dołóż 1 kg lub 1 powtórzenie w kluczowych bojach.” |
| Stany | Z charakterem | „Optymalizacja…”, „Synchronizacja Elite…”, „Analiza Elite Pro…” |

### Czego unikamy
- Zdrobnień i infantylnego tonu („brzuszek”, „kilo­gramiki”).
- Ściany tekstu — porady są krótkie i wykonalne.
- Medycznych obietnic i straszenia.
- Nadmiaru emoji w warstwie systemowej (emoji są OK w treściach lifestyle: cele, przepisy).

### Język
Produkt jest **po polsku**. Anglicyzmy dozwolone jako „terminy markowe” (Elite, Pro,
GPS Live, Bio-Intelligence, Atlas), ale interfejs i komunikaty użytkownika — polskie.

---

## 5. Logo i znak

### Znak (symbol)
Abstrakcyjny **monogram zbudowany z dwóch krzyżujących się, strzałkowatych form**
przypominających literę „K” / grot skierowany w górę / skrzyżowane sztangi. Symbolizuje
**ruch w górę (progres)** i **scalanie wielu rzeczy w jedno** (dwa elementy splecione w znak).

### Wariant podstawowy
- Znak w **niebieskim gradiencie** (jasny błękit → nasycony błękit) na **białym tle**
  (ikona launchera) — wariant „store / ikona aplikacji”.
- W interfejsie aplikacji znak/akcent występuje jako **biały** lub **błękitny** na czerni.

### Logo zastępcze w UI
W aplikacji jako sygnet używana bywa ikona **`Zap` (błyskawica)** oraz **`Dumbbell`
(hantel)** w białym kwadracie-squircle na czerni (splash, ekran powitalny). To
elementy pomocnicze — docelowo zastąpić właściwym monogramem KILO dla pełnej spójności.

### Strefa ochronna
Minimalny margines wokół znaku = **wysokość połowy znaku** z każdej strony. Nie umieszczać
tekstu ani innych elementów w tej strefie.

### Minimalne rozmiary
- Ikona aplikacji: zgodnie ze standardami iOS/Android (dostarczone w `mipmap-*`).
- Znak w UI: nie mniej niż **24 px** wysokości.

### Czego NIE robić ze znakiem
- ❌ Nie obracać (poza celowym `-rotate-6` w sygnecie powitalnym).
- ❌ Nie zmieniać proporcji ani nie rozciągać.
- ❌ Nie stosować innych kolorów niż: biały, czerń, błękit `#2563EB` lub firmowy gradient.
- ❌ Nie dodawać cieni/obrysów spoza systemu (dozwolona tylko firmowa poświata).
- ❌ Nie umieszczać niebieskiego znaku na niebieskim tle (brak kontrastu).

---

## 6. Kolory

KILO opiera się na zasadzie **„Modern Noir + jeden elektryczny akcent”**:
monochromatyczny fundament (czerń/biel/szarości) i **elektryczny błękit** jako jedyny
kolor-bohater. Pozostałe kolory są **wyłącznie funkcjonalne** (sukces, ostrzeżenie, błąd,
makroskładniki).

### 6.1 Kolory bazowe — „Modern Noir”
| Token | HEX | HSL | Zastosowanie |
|---|---|---|---|
| `kilo-black` / tło | `#000000` | `0 0% 0%` | Główne tło aplikacji |
| `kilo-dark` / karta | `#1A1A1A` | `0 0% 10%` | Karty, popovery, sekcje |
| Powierzchnia podniesiona | `#262626` | `0 0% 15%` | Secondary, accent, inputy |
| Tło sidebara | `#0D0D0D` | `0 0% 5%` | Najgłębsze tło |
| Obramowanie | `#333333` | `0 0% 20%` | Bordery, linie |
| `kilo-gray` (tekst II) | `~#8E8E93` | `240 1% 56%` | Tekst drugorzędny, opisy |
| `kilo-white` / treść | `#FFFFFF` | `0 0% 100%` | Tekst główny, akcent prymarny |

> **Uwaga:** w systemie `--primary` to **biel na czerni** — przyciski „głównej akcji”
> bywają białe z czarnym tekstem (np. „Generuj Plan”, „Dodaj do dziennika”).

### 6.2 Kolor-bohater — „Elite Blue”
| Token | HEX | Zastosowanie |
|---|---|---|
| **Elite Blue 600** | `#2563EB` | **Główny akcent**: kluczowe CTA, aktywne stany, AI, highlighty |
| Elite Blue 500 | `#3B82F6` | Teksty akcentowe, ikony |
| Elite Blue 400 | `#60A5FA` | Nawodnienie / lżejszy akcent |
| Indigo 600 | `#4F46E5` | Druga barwa gradientu „Neural / Bio-Intelligence” |

**Gradient firmowy:** `#60A5FA → #2563EB` (znak, ikona) oraz `#2563EB → #4F46E5`
(panele „Data Intelligence”).

### 6.3 Kolory funkcjonalne (semantyczne)
| Znaczenie | HEX | Użycie |
|---|---|---|
| Sukces / zdrowie / cardio | `#10B981` (emerald-500) | GPS LIVE, ukończone serie, tętno, postęp |
| Ostrzeżenie / energia | `#F59E0B`–`#EAB308` | Ikona `Zap`, energia, uwagi |
| Spalone kalorie / tłuszcz | `#F97316` (orange-500) | Kalorie z treningu, makro „tłuszcze” |
| Błąd / destrukcja / STOP | `#DC2626`–`#EF4444` | „Zresetuj dane”, STOP cardio, usuwanie |

### 6.4 Kolory makroskładników (ujednolicone)
Aby wykresy makro były spójne w całej aplikacji, przyjmujemy **jeden standard**:

| Makro | Kolor | HEX |
|---|---|---|
| **Białko (B)** | Elite Blue | `#2563EB` |
| **Węgle (W)** | Emerald | `#10B981` |
| **Tłuszcze (T)** | Orange | `#F97316` |

> (W obecnym kodzie Dashboard używa wariantu monochromatycznego biel/szary/ciemny,
> a Diet — kolorowego. Standard kolorowy powyżej obowiązuje docelowo wszędzie —
> patrz §17.)

### 6.5 Proporcje użycia (zasada 60-30-10)
- **60%** czerń i ciemne powierzchnie (tło, karty).
- **30%** biel i szarości (tekst, ikony, obramowania).
- **10%** Elite Blue + kolory funkcjonalne (akcenty, CTA, statusy).

Akcent stosujemy **oszczędnie** — jego siła bierze się z kontrastu z czernią.

---

## 7. Typografia

### Krój
Systemowy stack (natywny wygląd na każdym urządzeniu, zero kosztu ładowania):

```
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

To oznacza **SF Pro** na Apple, **Segoe UI** na Windows, **Roboto** na Androidzie.
Jeśli marka kiedyś przejdzie na font firmowy, należy wybrać grotesk o mocnych, ciężkich
odmianach (np. w duchu Inter / Helvetica Now / SF Pro Display).

### Sygnaturowy zabieg typograficzny KILO
Nagłówki marki mają rozpoznawalny, „sportowy” charakter — to **DNA typografii KILO**:

```
font-weight: 900 (black)  +  UPPERCASE  +  italic  +  tracking ciasny (tighter)
```

Przykład: **`KILO ELITE`**, **`TWÓJ CEL`**, **`ELITE PRO`**, **`DIETA`**.

### Skala typograficzna
| Poziom | Rozmiar | Styl | Przykład |
|---|---|---|---|
| Display / Hero | 60 px (`text-6xl`) | black · italic · UPPERCASE · tighter | „KILO ELITE”, licznik „zostało energii” |
| H1 (tytuł ekranu) | 30–36 px | black · italic · UPPERCASE · tighter | „PROFIL”, „DIETA”, „Cześć, {imię}!” |
| H2 (sekcja) | 24 px | black · italic · UPPERCASE | tytuły modali, „Lista Zakupów” |
| H3 / nagłówek karty | 14–18 px | black · UPPERCASE · italic | „Twoje Makro”, „Postępy Siłowe” |
| Etykieta sekcji | 10–12 px | black/bold · UPPERCASE · tracking szeroki | „DATA INTELLIGENCE”, „PARAMETRY” |
| Body | 14 px | medium/bold | opisy, treść porad |
| Mikro-etykieta | 8–10 px | black/bold · UPPERCASE · tracking szeroki | „GPS LIVE”, „DYSTANS KM” |

### Zasady
- **Liczby/dane** często `tabular-nums` + `italic` + black — dają „cyfrowy, pomiarowy”
  charakter (timery, ciężar, dystans).
- **Tracking:** nagłówki = ciasny (`tracking-tighter`); etykiety = szeroki
  (`tracking-widest` / `0.2em`–`0.5em`).
- **Italic** rezerwujemy dla nagłówków i danych — nie dla zwykłego body.
- Nie mieszać więcej niż 2–3 poziomów wagi na jednym ekranie.

---

## 8. Kształty, przestrzeń i zaokrąglenia

### Zaokrąglenia (signature: duże „squircle”)
KILO jest **bardzo zaokrąglone** — to element rozpoznawalności. Bazowy promień to
**`1.5rem` (24 px)**, a karty premium idą wyżej.

| Token | Wartość | Użycie |
|---|---|---|
| `sm` | 20 px | drobne elementy |
| `md` | 22 px | inputy, mniejsze przyciski |
| `lg` (bazowy `--radius`) | **24 px** | standard |
| `rounded-2xl` | 16 px | przyciski, małe karty |
| `rounded-3xl` | 24 px | karty |
| `rounded-[2rem]` | 32 px | karty treści |
| `rounded-[2.5rem]` | 40 px | duże panele, modale |
| `rounded-[3rem]` | 48 px | hero-karty, arkusze |
| `rounded-full` | ∞ | awatary, pigułki, kropki statusu, dni tygodnia |

### Siatka i odstępy
- Padding ekranu: **20 px** po bokach (`px-5`), górny safe-area **48 px** (`pt-12`).
- Dolny padding na nawigację: **80 px + safe-area** (`safe-bottom`).
- Odstępy między sekcjami: **24 px** (`space-y-6`) / **32 px** (`space-y-8`).
- Maksymalna szerokość treści: **`max-w-md`** (mobile-first, wyśrodkowane).
- Respektujemy **safe-area** iOS (notch / pasek dolny) — zawsze.

### Layout
- **Mobile-first**, pionowa orientacja.
- **Dolna nawigacja** (4 zakładki) jako stała kotwica.
- Treść w jednej kolumnie, kafelki/akcje czasem 2- lub 4-kolumnowe.

---

## 9. Efekty: glassmorfizm, poświata, gradienty

### Glassmorfizm (kluczowy efekt marki)
„Szklane” powierzchnie budują głębię na czerni:

```
backdrop-blur: 20px
tło: czarna karta @ 70% (bg-card/70)
obramowanie: biel @ 10% (border-white/10)
duże zaokrąglenie (3xl+)
```

Stosowane w: dolnej nawigacji (`glass-nav`), kartach (`glass-card`), nagłówkach modali.

### Poświata (glow)
Subtelna poświata podkreśla elementy „pod napięciem”:
- Biała poświata wokół sygnetu: `0 0 30px rgba(255,255,255,0.2)`.
- Niebieska poświata pod CTA / panelami AI: `shadow-blue-600/20`, `0 0 50px rgba(37,99,235,0.15)`.

> Zasada: poświata = „to jest ważne / aktywne / inteligentne”. Nie nadużywać.

### Gradienty
- Znak/ikona: błękitny gradient `#60A5FA → #2563EB`.
- Panele „Bio-Intelligence / Neural”: `blue-600 → indigo-600`.
- Słupki wykresu siły: `from-blue-700 to-blue-400`.
- Przyciemnienia na zdjęciach: `from-black via-transparent to-transparent`.

---

## 10. Ikonografia

- **Biblioteka:** [Lucide](https://lucide.dev) (`lucide-react`) — jeden, spójny zestaw.
- **Styl:** liniowy, `stroke`, zaokrąglone końce; domyślnie **24 px**.
- **Kolor:** biały / szary (stan nieaktywny) lub Elite Blue (akcent/aktywny).
- **Wypełnienie:** dozwolone dla akcentów energii (`Zap` z `fill="currentColor"`).

### Ikony-sygnatury (zarezerwowane znaczenia)
| Ikona | Znaczenie w KILO |
|---|---|
| `Zap` (błyskawica) | Energia, „Elite”, akcent marki |
| `Dumbbell` | Trening siłowy, splash |
| `Navigation` / `Bike` | Cardio / GPS |
| `BrainCircuit` / `Brain` | AI, „Neural”, Bio-Intelligence |
| `Footprints` | Kroki |
| `Flame` | Kalorie |
| `Droplets` | Nawodnienie |
| `ScanLine` / `Camera` | Skaner posiłków |
| `ShieldCheck` | Wiarygodność danych / analiza |

### Nawigacja dolna (4 ikony)
`Home` → Start · `Dumbbell` → Trening · `Utensils` → Dieta · `User` → Profil.

---

## 11. Ruch i animacja

Silnik: **Framer Motion**. Ruch ma być **płynny, sprężysty i celowy** — nigdy ozdobny.

### Wzorce
| Wzorzec | Parametry | Gdzie |
|---|---|---|
| Wejście modali / arkuszy | slide-up `y: '100%' → 0` | przepisy, sesja treningu, edytory |
| Panele boczne | slide-in `x: '100%' → 0` | lista zakupów, historia, zapis sesji |
| Sprężyna | `type: spring, stiffness: 400, damping: 17–30` | nawigacja, kafelki |
| Przejścia kroków | `opacity + y: 10` z `AnimatePresence mode="wait"` | onboarding |
| Shared element | `layoutId="nav-indicator"` | wskaźnik aktywnej zakładki |
| Tap feedback | `active:scale-95` / `whileTap={{ scale: 0.95 }}` | wszystkie przyciski/kafelki |
| Stan „żywy” | `animate-pulse` | „GPS LIVE”, „Analiza…”, ładowanie |
| Loader | obrót `rotate: 360`, `repeat: Infinity, linear` | „Optymalizacja…”, „System Booting” |

### Zasady
- Czas trwania mikro-interakcji: **0,2–0,5 s**.
- Każde dotknięcie ma odpowiedź wizualną (scale/feedback).
- Animacja nie blokuje treści — najpierw użyteczność.

---

## 12. Fotografia i obrazy

Jedyny obszar, gdzie do czerni wpuszczamy bogaty kolor, to **zdjęcia jedzenia**.

### Styl fotografii kulinarnej
- **Apetyczna, naturalna, „food editorial”** (źródło referencyjne: Unsplash w obecnej wersji).
- Kadr z góry lub pod kątem 45°, naturalne światło, miska/talerz jako bohater.
- Zdjęcia zawsze w **dużych zaokrągleniach** (`rounded-[2rem]`–`[3rem]`).
- Na zdjęciach z tekstem: gradient przyciemniający od dołu (`from-black`) dla czytelności.

### Ilustracje / puste stany
- Minimalistyczne: ikona Lucide + krótki tekst (np. „Dodaj swój pierwszy trening, aby
  zobaczyć wykres progresu”).
- Mapy cardio: filtr **grayscale + kontrast + przyciemnienie** (`grayscale(0.6)
  contrast(1.2) brightness(0.8)`), by mapa pasowała do estetyki Noir.

---

## 13. Komponenty UI

Fundament: **shadcn/ui** (na Radix UI) + Tailwind. Poniżej komponenty „markowe”.

### Karta (KILO Card / Glass Card)
Ciemna powierzchnia, duże zaokrąglenie, opcjonalnie szklana.
```
bg-card  rounded-3xl  p-4            // kilo-card
backdrop-blur-[20px] bg-card/70 border border-white/10 rounded-3xl   // glass-card
```

### Przyciski
| Typ | Wygląd | Użycie |
|---|---|---|
| **Primary (biały)** | białe tło, czarny tekst, black/italic/UPPERCASE | główna akcja kroku |
| **Elite (niebieski)** | `bg-blue-600`, biały tekst, poświata | akcje „Pro/AI”, finalizacja |
| **Secondary (ciemny)** | `bg-zinc-900`, obramowanie | akcje drugorzędne, logowanie |
| **Destructive** | `bg-red-600` / `bg-red-500/10` | STOP, reset, usuwanie |
| Wysokość dotykowa | **64 px** (`h-16`) dla głównych CTA | komfort kciuka |

### ProgressRing (pierścień postępu)
Sygnaturowy komponent: SVG, obrót -90°, zaokrąglony koniec, animacja `stroke-dashoffset`
0,5 s. Używany do kroków i makro. Konfigurowalny rozmiar/grubość/kolor, środek na treść (%).

### Dolna nawigacja (Glass Nav)
Stała, szklana, 4 zakładki, sprężysty wskaźnik aktywności (`layoutId`), respektuje safe-area.

### Modale / arkusze
Pełnoekranowe, wjazd od dołu lub z boku, ciemne tło, duże zaokrąglone nagłówki,
przycisk zamknięcia w kółku (`bg-white/5 rounded-full`).

### Onboarding
Pasek postępu u góry (białe segmenty na `zinc-800`), duże nagłówki, kafelki wyboru
z obramowaniem aktywnym (białe), CTA „Dalej / Generuj Plan”.

### Tutorial / coachmarks
Nakładka `bg-black/80 backdrop-blur`, dymek z niebieskim obramowaniem i strzałką,
numerowane kroki, „Pomiń / Dalej”.

### Stany
- **Pusty:** ikona + krótki tekst w obramowaniu przerywanym.
- **Ładowanie:** spinner/obrót + tekst „…” (np. „Synchronizacja Elite…”).
- **Sukces:** zielony akcent (emerald), `CheckCircle2`.
- **Toast:** powiadomienia (sonner) — krótkie potwierdzenia („Zapisano w dzienniku”).

---

## 14. Trenerzy AI — bohaterowie marki

KILO ma trzech trenerów AI o wyrazistych rolach. To **postacie marki** — ich osobowości
powinny być spójne wszędzie (czat, powiadomienia, materiały).

| Trener | Rola | Kolor | Charakter |
|---|---|---|---|
| **Kamil** | Ekspert Siły | Elite Blue `#2563EB` | Techniczny, rzeczowy, „inżynier treningu”. Mówi o objętości, tempie, technice. |
| **Marta** | Specjalistka Redukcji | Emerald `#10B981` | Wspierająca, precyzyjna w diecie i deficycie. Spokój i konsekwencja. |
| **Seba** | Motywator Elite | Orange `#F97316` | Energia, „hype”, kopniak motywacyjny. Krótko, mocno, do działania. |

### Zasady komunikacji AI
- Odpowiedzi **po polsku**, **max 3 zdania**, konkretne i wykonalne.
- Zwracają się do użytkownika po imieniu (lub „Mistrz”).
- Bazują na profilu (cel, dane) — personalizacja, nie ogólniki.
- Silnik: model generatywny Google (Gemini). Persona zależy od `trainerRole`.

> Wskazówka brandowa: każdy trener trzyma się swojego koloru i tonu. Kamil nie krzyczy
> jak Seba; Seba nie wykłada biomechaniki jak Kamil.

---

## 15. Mikrokopia i słownik „Elite”

Spójny język produktu. Używamy tych terminów konsekwentnie:

| Termin | Znaczenie |
|---|---|
| **Elite / Elite Pro** | Warstwa premium funkcji i tonu |
| **Bio-Intelligence** | Sekcja analiz (siła, tętno, masa) |
| **Neural Analysis / System Reports** | Raporty/analizy w profilu |
| **Elite AI Advisor** | Porada AI po treningu |
| **Atlas** | Baza ćwiczeń z „protipami” |
| **Elite Protip** | Wskazówka techniczna do ćwiczenia |
| **Nutri-Engine** | „Silnik” dietetyczny |
| **GPS LIVE** | Aktywne śledzenie trasy cardio |
| **Volume / Objętość** | Ciężar × powtórzenia (kg) |
| **Recomp / Redukcja / Masa** | Cele: rekompozycja / cut / bulk |
| **Makro (B / W / T)** | Białko / Węgle / Tłuszcze |

### Przykładowe komunikaty (wzorce)
- Powitanie: **„Cześć, {imię}!”**
- Cel kroku: **„ZOSTAŁO ENERGII — {n} kcal”**
- Stan ładowania: **„Optymalizacja…”**, **„Synchronizacja Elite…”**
- Potwierdzenie: **„Zapisano w dzienniku”**
- Pusty wykres: **„Dodaj swój pierwszy trening, aby zobaczyć wykres progresu”**

---

## 16. Zasady spójności (Do & Don't)

### ✅ Rób
- Trzymaj **czarne tło** jako domyślne i dominujące.
- Używaj **jednego akcentu** (Elite Blue) jako koloru-bohatera; reszta = funkcja.
- Stosuj sygnaturę typograficzną (black + UPPERCASE + italic + tighter) w nagłówkach.
- Stosuj **duże zaokrąglenia** konsekwentnie.
- Dawaj **feedback dotykowy** na każdą interakcję.
- Pisz **krótko, konkretnie, po polsku**.
- Respektuj **safe-area** i wysoki kontrast (WCAG AA dla tekstu).

### ❌ Nie rób
- Nie wprowadzaj jasnego (białego) motywu jako głównego — KILO jest „dark-first”.
- Nie używaj wielu kolorów akcentu naraz „dla ozdoby”.
- Nie mieszaj różnych zestawów ikon (tylko Lucide).
- Nie infantylizuj języka ani nie zasypuj emoji warstwy systemowej.
- Nie używaj małych, ciasnych celów dotykowych (min. ~44–64 px).
- Nie nadużywaj poświaty i animacji.

---

## 17. Wykryte niespójności i rekomendacje

Analiza kodu ujawniła kilka rozjazdów w identyfikacji. Rekomendacje, by domknąć spójność:

1. **Dwie tożsamości kolorystyczne.** `index.css` definiuje system **monochromatyczny**
   (biel jako `--primary`), a strony Diet/Workout/Profile i ikona launchera używają
   **Elite Blue**. → *Rekomendacja:* uznać **Noir + Elite Blue** za oficjalny system
   (jak w tym dokumencie) i ujednolicić tokeny — dodać `--primary`/akcent niebieski do
   zmiennych CSS zamiast hardkodować `blue-600` po stronach.

2. **Kolory makro.** Dashboard rysuje pierścienie makro w bieli/szarości/ciemności,
   a Diet w niebieskim/zielonym/pomarańczowym. → *Rekomendacja:* przyjąć jeden standard
   (B = niebieski, W = zielony, T = pomarańczowy — §6.4) w obu miejscach.

3. **`theme_color`.** `manifest.json` ma `#0ea5e9` (sky), `background_color` `#ffffff`,
   a `index.html` `theme-color` `#000000`. → *Rekomendacja:* ustawić `theme_color`
   i `background_color` na **`#000000`** (dark-first), ewentualnie akcent na `#2563EB`.

4. **Naming.** Współistnieją „Kilo”, „KiloApp”, „KILO ELITE”. → *Rekomendacja:*
   trzymać się architektury z §3 (marka **KILO**, app **Kilo**, sub-brand **KILO ELITE**).

5. **Sygnet zastępczy.** Splash/onboarding używają ikon `Zap`/`Dumbbell` zamiast
   właściwego monogramu KILO. → *Rekomendacja:* podmienić na docelowy znak.

6. **Bezpieczeństwo (poza brandingiem, ale ważne).** W repo znajdują się **zaszyte
   klucze API** (Google Generative AI w `src/lib/gemini.ts` oraz konfiguracja Firebase
   w `src/lib/firebase.ts`). Konfiguracja webowa Firebase bywa publiczna, ale **klucz
   do API modelu generatywnego nie powinien być w kliencie** — przenieść wywołania AI
   na backend/proxy i zrotować klucz. (Nie jest to element brandbooka, ale wymaga pilnej
   uwagi.)

---

## 18. Aneks: stack technologiczny i mapa funkcji

### Stack
- **Frontend:** Vite + React 18 + TypeScript
- **UI:** Tailwind CSS + shadcn/ui (Radix UI) + lucide-react
- **Animacja:** Framer Motion
- **Routing:** React Router; **dane serwerowe:** TanStack Query
- **Backend/Chmura:** Firebase (Auth: Google / Apple / anonimowo, Firestore, Analytics)
- **AI:** Google Generative AI (Gemini 1.5 Flash) — trenerzy + porady
- **Natywnie:** Capacitor 8 (iOS + Android), PWA (vite-plugin-pwa)
- **Inne:** react-webcam (skaner), recharts (wykresy), date-fns
- **Przechowywanie:** localStorage + synchronizacja do Firestore

### Mapa funkcji (ekrany)
| Ekran | Zawartość |
|---|---|
| **Onboarding** | Logowanie, biometria, poziom aktywności, środowisko (siłownia/dom), doświadczenie, cel → wyliczenie kalorii i makro (Mifflin-St Jeor → TDEE → cel) |
| **Dashboard** | Powitanie, pasek tygodnia, kroki (ring), makro (ringi), szybkie akcje, trenerzy AI, polecane przepisy, progres siłowy, splash + tutorial |
| **Dieta** | Pozostała energia, paski makro, dziennik posiłków, nawodnienie (12 szklanek), baza 10 przepisów (makro, składniki, kroki, mikroelementy), lista zakupów, skaner |
| **Trening** | 4 zakładki: **Siła** (plany, sesja, serie/powt., timer przerw 90 s, objętość), **Cardio** (GPS, mapa, dystans, czas), **Atlas** (~28 ćwiczeń + protipy), **Historia** (sesje, AI Advisor, objętość, kalorie, rozkład) |
| **Profil** | Awatar, Bio-Intelligence (siła, tętno, masa), integracja z zegarkami (Apple Watch / Samsung Health / Garmin), parametry (waga/wzrost), wyloguj/reset |

---

*Brandbook żywy — aktualizować wraz z rozwojem produktu. Sekcja §17 to lista zadań do
domknięcia pełnej spójności wizualnej.*
