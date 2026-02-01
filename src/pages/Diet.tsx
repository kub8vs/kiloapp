import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { 
  Camera, X, Loader2, Sparkles, Plus, Minus, BookOpen, Trash2, 
  ShoppingCart, ChevronRight, Info, Droplets, Zap, CheckCircle2, ListPlus
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/user-store";

const glassStyle = "bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl";

const RECIPES = [
  { 
    id: 1, name: "Pancakes Proteinowe", cat: "Śniadanie", kcal: 450, p: 35, c: 45, f: 10, weight: 250,
    difficulty: "Łatwe", ig: "Niskie", time: "15 min", micros: "Potas, Magnez (Regeneracja mięśni)",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?q=80&w=500&auto=format&fit=crop",
    ingredients: ["2 jajka", "30g odżywki białkowej", "1 banan", "40g płatków owsianych", "5g oleju kokosowego"],
    steps: "1. Rozpocznij od zblendowania płatków owsianych na mąkę. Następnie dodaj dojrzałego banana, jajka oraz odżywkę białkową. Blenduj do momentu uzyskania gęstej, jednolitej masy bez grudek. 2. Rozgrzej patelnię na średnim ogniu i delikatnie natłuść ją olejem kokosowym (użyj pędzelka dla minimalnej ilości tłuszczu). 3. Nakładaj porcje ciasta, tworząc placki o średnicy ok. 10 cm. Smaż do momentu, gdy na powierzchni pojawią się bąbelki powietrza (ok. 2 minuty), a następnie energicznie obróć. Smaż jeszcze minutę do uzyskania złotobrązowego koloru. Podawaj z owocami jagodowymi."
  },
  { 
    id: 2, name: "Bowl z Pieczonym Łososiem", cat: "Obiad", kcal: 620, p: 40, c: 55, f: 28, weight: 400,
    difficulty: "Średnie", ig: "Niskie", time: "25 min", micros: "Omega-3, Wit. D (Zdrowie serca)",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=500&auto=format&fit=crop",
    ingredients: ["150g łososia", "100g ryżu basmati", "50g awokado", "Garść edamame", "Sos sojowy"],
    steps: "1. Rozgrzej piekarnik do 200°C. Filet z łososia osusz papierowym ręcznikiem, oprósz solą morską i pieprzem. Piecz skórą do dołu na blaszce wyłożonej pergaminem przez dokładnie 12-14 minut – dzięki temu ryba pozostanie soczysta w środku. 2. W międzyczasie przepłucz ryż basmati pod zimną wodą, aż woda będzie klarowna. Gotuj go w proporcji 1:2 (ryż:woda) pod przykryciem na minimalnym ogniu przez 10 minut, a potem pozwól mu odpocząć przez kolejne 5 minut. 3. Skonstruuj bowl: na spodzie ułóż puszysty ryż, na nim połóż upieczonego łososia, plastry dojrzałego awokado oraz ugotowane na parze ziarna edamame. Całość skrop wysokiej jakości sosem sojowym i opcjonalnie posyp czarnym sezamem."
  },
  { 
    id: 3, name: "Szakszuka z Fetą", cat: "Śniadanie", kcal: 380, p: 22, c: 15, f: 25, weight: 350,
    difficulty: "Łatwe", ig: "Średnie", time: "20 min", micros: "Luteina, Żelazo (Wzrok i krew)",
    image: "https://images.unsplash.com/photo-1590412200988-a436bb7050a8?q=80&w=500&auto=format&fit=crop",
    ingredients: ["3 jajka", "200g pomidorów z puszki", "30g sera feta", "Cebula", "Czosnek", "Oliwa"],
    steps: "1. Na głębokiej patelni rozgrzej oliwę. Wrzuć drobno posiekaną cebulę i smaż, aż stanie się szklista. Dodaj przeciśnięty przez praskę czosnek oraz opcjonalnie kumin i słodką paprykę, smażąc jeszcze przez 30 sekund, aby przyprawy uwolniły aromat. 2. Wlej pomidory z puszki i rozgnieć je szpatułką. Duś sos na średnim ogniu przez około 8-10 minut, aż nadmiar wody odparuje, a sos wyraźnie zgęstnieje. 3. Zrób w sosie trzy wgłębienia i ostrożnie wbij w nie jajka. Zmniejsz ogień do minimum, przykryj patelnię pokrywką i gotuj przez ok. 3-5 minut – białka powinny być całkowicie ścięte, a żółtka pozostać płynne. Na koniec posyp danie pokruszoną fetą i świeżą kolendrą."
  },
  { 
    id: 4, name: "Kurczak Curry z Mango", cat: "Obiad", kcal: 550, p: 48, c: 60, f: 12, weight: 450,
    difficulty: "Średnie", ig: "Średnie", time: "30 min", micros: "Wit. C, Cynk (Odporność)",
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=500&auto=format&fit=crop",
    ingredients: ["180g piersi z kurczaka", "50g ryżu", "100ml mleczka kokosowego", "Pół mango", "Pasta curry"],
    steps: "1. Pierś z kurczaka pokrój w równą kostkę (ok. 2 cm). Na patelni typu wok rozgrzej odrobinę oleju i krótko przesmaż pastę curry, aby stała się intensywnie pachnąca. 2. Dodaj kurczaka i smaż na dużym ogniu przez 3-4 minuty, aż zamknie pory. Wlej mleczko kokosowe, zmniejsz ogień i duś pod przykryciem przez 10 minut, pozwalając mięsu skruszeć w aromatycznym sosie. 3. Mango obierz i pokrój w kostkę. Dodaj je do sosu na samym końcu gotowania (na ostatnie 2 minuty), aby owoce lekko zmiękły, ale nie rozpadły się całkowicie. Podawaj z ugotowanym na sypko ryżem jaśminowym, który idealnie balansuje pikantność curry."
  },
  { 
    id: 5, name: "Tofu Stir-Fry", cat: "Kolacja", kcal: 410, p: 28, c: 42, f: 15, weight: 380,
    difficulty: "Łatwe", ig: "Niskie", time: "15 min", micros: "Wapń, Mangan (Mocne kości)",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
    ingredients: ["180g tofu", "Mix warzyw mrożonych", "30g makaronu ryżowego", "Imbir", "Sezam"],
    steps: "1. Tofu wyjmij z zalewy i bardzo dokładnie osusz ręcznikiem papierowym – to klucz do chrupkości. Pokrój w kostkę i smaż na mocno rozgrzanej patelni z odrobiną oleju sezamowego, aż każda strona będzie złocista. 2. Zdejmij tofu z patelni i wrzuć na nią mix warzyw oraz starty świeży imbir. Smaż techniką stir-fry (cały czas mieszając na bardzo dużym ogniu) przez ok. 5 minut, aby warzywa pozostały chrupkie (al dente). 3. Makaron ryżowy przygotuj według instrukcji (zwykle wystarczy zalać wrzątkiem na kilka minut). Połącz makaron, warzywa i tofu na patelni, wymieszaj z odrobiną sosu sojowego i smaż razem przez ostatnią minutę. Przed podaniem posyp obficie prażonym sezamem."
  },
  { 
    id: 6, name: "Serek Wiejski na Słodko", cat: "Przekąski", kcal: 320, p: 28, c: 30, f: 10, weight: 300,
    difficulty: "Bardzo łatwe", ig: "Niskie", time: "5 min", micros: "Wapń (Kazeina na noc)",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=500&auto=format&fit=crop",
    ingredients: ["200g serka wiejskiego", "15g masła orzechowego", "Borówki", "Migdały"],
    steps: "1. Serek wiejski przełóż do ulubionej miseczki. Jeśli wolisz bardziej kremową konsystencję, możesz go delikatnie odcedzić z nadmiaru śmietanki. 2. Masło orzechowe, jeśli jest zbyt gęste, podgrzej przez 10 sekund w mikrofalówce, aby uzyskać płynną nitkę, którą ozdobisz wierzch. Wymieszaj połowę masła z serkiem, a drugą połowę zostaw do dekoracji. 3. Dodaj świeże borówki oraz posiekane migdały (możesz je wcześniej uprażyć na suchej patelni dla lepszego aromatu). To idealna, bogata w kazeinę przekąska przed snem, która zapewni stabilny dopływ aminokwasów przez całą noc."
  },
  { 
    id: 7, name: "Wrap z Wołowiną", cat: "Kolacja", kcal: 490, p: 38, c: 45, f: 18, weight: 280,
    difficulty: "Średnie", ig: "Średnie", time: "20 min", micros: "B12, Żelazo (Energia)",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=500&auto=format&fit=crop",
    ingredients: ["1 tortilla", "120g chudej wołowiny", "Papryka", "Fasola", "Jogurt naturalny"],
    steps: "1. Chudą wołowinę mieloną smaż na patelni bez dodatku tłuszczu (mięso puści własny sok). Dopraw kuminem, chili i wędzoną papryką. Gdy mięso przestanie być surowe, dodaj odsączoną czerwoną fasolę i smaż jeszcze 3 minuty. 2. Placki tortilli podgrzej przez 30 sekund na suchej patelni, aby stały się elastyczne i nie pękały przy zawijaniu. 3. Na środek tortilli nałóż porcję mięsa z fasolą, dodaj pokrojoną w słupki świeżą paprykę dla chrupkości i kleks jogurtu naturalnego, który złagodzi pikantność. Zawiń dół tortilli do środka, a następnie boki, tworząc ciasny rulon."
  },
  { 
    id: 8, name: "Sałatka Cezar Elite", cat: "Kolacja", kcal: 440, p: 42, c: 12, f: 24, weight: 320,
    difficulty: "Łatwe", ig: "Niskie", time: "15 min", micros: "Wit. K, Selen (Zdrowa tarczyca)",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500&auto=format&fit=crop",
    ingredients: ["150g kurczaka", "Sałata rzymska", "15g parmezanu", "Grzanki", "Czosnek"],
    steps: "1. Pierś z kurczaka pokrój w poprzek włókien, oprósz solą i grilluj na patelni grillowej po 4 minuty z każdej strony, aż pojawią się charakterystyczne paski. Odstaw mięso na deskę na 2 minuty przed pokrojeniem, aby soki się ustabilizowały. 2. Sałatę rzymską porwij rękami na mniejsze kawałki (nie krój nożem, aby nie zgorzkniała). Wymieszaj ją w dużej misce z sosem przygotowanym na bazie jogurtu, czosnku i musztardy dijon. 3. Na talerzu ułóż bazę z sałaty, na wierzchu rozłóż plastry kurczaka. Całość posyp płatkami parmezanu (użyj obieraczki do warzyw dla cienkich płatków) oraz pełnoziarnistymi grzankami."
  },
  { 
    id: 9, name: "Owsianka Nocna Brownie", cat: "Śniadanie", kcal: 510, p: 32, c: 65, f: 14, weight: 350,
    difficulty: "Łatwe", ig: "Niskie", time: "5 min", micros: "Błonnik (Zdrowe jelita)",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=500&auto=format&fit=crop",
    ingredients: ["50g płatków owsianych", "20g odżywki czekoladowej", "10g kakao", "150ml mleka", "Chia"],
    steps: "1. Do słoika lub szczelnego pojemnika wsyp płatki owsiane (najlepiej górskie dla lepszej tekstury), odżywkę białkową, ciemne kakao oraz nasiona chia. 2. Wlej mleko (roślinne lub krowie) i bardzo dokładnie wymieszaj, upewniając się, że odżywka się rozpuściła, a nasiona chia nie zbiły w grudki na dnie. 3. Zamknij słoik i wstaw do lodówki na minimum 6-8 godzin (najlepiej na całą noc). W tym czasie płatki i nasiona chia wchłoną płyn, tworząc gęstą konsystencję przypominającą budyń czekoladowy. Rano wymieszaj energicznie – jeśli owsianka jest zbyt gęsta, dodaj odrobinę mleka. Możesz udekorować posiekaną gorzką czekoladą."
  },
  { 
    id: 10, name: "Stek z Kalafiora", cat: "Obiad", kcal: 350, p: 15, c: 35, f: 18, weight: 450,
    difficulty: "Średnie", ig: "Niskie", time: "30 min", micros: "Foliany, Wit. C (Detoks)",
    image: "https://images.unsplash.com/photo-1628543302703-9ee7c0e7ee5b?q=80&w=500&auto=format&fit=crop",
    ingredients: ["Plaster kalafiora", "50g hummusu", "Granat", "Oliwa", "Kumin"],
    steps: "1. Z całej główki kalafiora wytnij środkowy plaster o grubości ok. 2-3 cm (tak, aby głąb trzymał różyczki razem). Pozostałe części kalafiora zachowaj do zupy. 2. Plaster posmaruj pędzelkiem oliwą wymieszaną z kuminem, wędzoną papryką i solą. Piecz w piekarniku nagrzanym do 200°C przez około 25 minut, obracając w połowie czasu, aż brzegi kalafiora mocno się skarmelizują i staną chrupiące. 3. Na talerzu rozsmaruj grubą warstwę hummusu, tworząc bazę. Połóż na nim upieczony 'stek' z kalafiora. Całość posyp obficie pestkami granatu, które dodadzą świeżości i słodko-kwaśnego kontrastu dla pieczonych warzyw."
  }
];

const Diet = () => {
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [meals, setMeals] = useState<any>({
    breakfast: { name: "Śniadanie", items: [] },
    lunch: { name: "Obiad", items: [] },
    dinner: { name: "Kolacja", items: [] },
    snacks: { name: "Przekąski", items: [] },
  });

  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [activeTab, setActiveTab] = useState<"recipes" | "scanner" | null>(null);
  const [selectedMealKey, setSelectedMealKey] = useState<string | null>("breakfast");
  const [viewingRecipe, setViewingRecipe] = useState<any>(null);
  const [tempWeight, setTempWeight] = useState(100);

  useEffect(() => {
    const savedData = getUserProfile();
    if (savedData) {
      const { weight, height, age, gender, activityLevel, goal } = savedData;
      let bmr = (10 * weight) + (6.25 * height) - (5 * age);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      let tdee = bmr * activityLevel;
      let targetKcal = goal === 'cut' ? tdee * 0.85 : goal === 'bulk' ? tdee * 1.10 : tdee;
      const p = weight * 2.2;
      const f = (targetKcal * 0.25) / 9;
      const c = (targetKcal - (p * 4) - (f * 9)) / 4;
      setUserProfile({ kcal: Math.round(targetKcal), p: Math.round(p), c: Math.round(c), f: Math.round(f), weight });
    }
  }, []);

  const dayTotals = useMemo(() => {
    let kcal = 0, p = 0, c = 0, f = 0;
    Object.values(meals).forEach((m: any) => m.items.forEach((i: any) => {
      kcal += i.kcal; p += i.p; c += i.c; f += i.f;
    }));
    return { kcal, p, c, f };
  }, [meals]);

  const calculateMacros = (item: any, newWeight: number) => {
    const factor = newWeight / (item.weight || 100);
    return { ...item, kcal: Math.round(item.kcal * factor), p: Math.round(item.p * factor), c: Math.round(item.c * factor), f: Math.round(item.f * factor), weight: newWeight };
  };

  const addToShoppingList = (ingredients: string[]) => {
    setShoppingList(prev => [...new Set([...prev, ...ingredients])]);
    toast({ title: "Lista Zakupów", description: "Składniki zostały dodane." });
  };

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-32 space-y-8 bg-black min-h-screen text-white font-sans">
        
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">DIETA</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Elite Nutri-Engine Active</p>
          </div>
          <button onClick={() => setIsShoppingListOpen(true)} className="relative p-4 bg-zinc-900 border border-white/10 rounded-2xl active:scale-95 transition-all">
            <ShoppingCart size={20} />
            {shoppingList.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-[10px] font-bold flex items-center justify-center">{shoppingList.length}</span>}
          </button>
        </header>

        {/* DASHBOARD */}
        <section className={`p-8 rounded-[2.5rem] ${glassStyle}`}>
          {!userProfile ? (
            <div className="flex items-center justify-center py-10 text-zinc-500">Synchronizacja Elite...</div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest italic">Zostało Energii</p>
                  <h2 className="text-6xl font-black italic tracking-tighter">{Math.max(0, userProfile.kcal - dayTotals.kcal)} <span className="text-sm opacity-20 ml-2 uppercase italic">kcal</span></h2>
                </div>
                <Zap className="text-yellow-500" size={30} fill="currentColor" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                 {[{l: "Białko", v: dayTotals.p, t: userProfile.p, bg: "bg-blue-600"}, {l: "Węgle", v: dayTotals.c, t: userProfile.c, bg: "bg-emerald-600"}, {l: "Tłuszcze", v: dayTotals.f, t: userProfile.f, bg: "bg-orange-600"}].map(m => (
                   <div key={m.l} className="space-y-2">
                     <p className="text-[8px] font-black uppercase text-zinc-500">{m.l}</p>
                     <p className="text-sm font-black italic">{m.v}<span className="text-[9px] opacity-20">/{m.t}g</span></p>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden"><motion.div animate={{ width: `${Math.min(100, (m.v / m.t) * 100)}%` }} className={`h-full ${m.bg}`} /></div>
                   </div>
                 ))}
              </div>
            </>
          )}
        </section>

        {/* DZIENNIK */}
        <section className="space-y-4">
          {Object.entries(meals).map(([key, meal]: [string, any]) => (
            <div key={key} className={`p-6 rounded-[2.5rem] ${glassStyle}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">{meal.name}</h3>
                <span className="text-xs font-black text-zinc-600">{meal.items.reduce((a: any, b: any) => a + b.kcal, 0)} kcal</span>
              </div>
              <div className="space-y-3">
                {meal.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                    <div className="text-xs font-bold uppercase">{item.name} <span className="text-[8px] opacity-30 ml-2">{item.weight}g</span></div>
                    <button onClick={() => setMeals((prev: any) => ({...prev, [key]: {...meal, items: meal.items.filter((i:any)=>i.id !== item.id)}}))}><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSelectedMealKey(key); setActiveTab("recipes"); }} className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-[9px] font-black uppercase text-zinc-700 flex items-center justify-center gap-2 mt-4">
                <Plus size={14} /> Dodaj produkt
              </button>
            </div>
          ))}
        </section>

        {/* NAWADNIANIE */}
        <section className={`p-6 rounded-[2.2rem] ${glassStyle} space-y-4`}>
          <div className="flex justify-between items-center text-blue-400 font-black uppercase text-[10px] tracking-widest"><Droplets size={18}/> Nawodnienie</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(12)].map((_, i) => (
              <button key={i} onClick={() => setWaterGlasses(i+1)} className={`w-7 h-10 rounded-lg border-2 transition-all ${i < waterGlasses ? 'bg-blue-600 border-blue-400' : 'border-zinc-800'}`} />
            ))}
          </div>
        </section>

        {/* REKOMENDOWANE PRZEPISY */}
        <section className="space-y-4 pt-4 pb-10">
           <h2 className="text-xs font-black uppercase text-zinc-600 px-1 italic">Rekomendowane Posiłki</h2>
           <div className="grid gap-4">
              {RECIPES.map(r => (
                <div key={r.id} onClick={() => { setViewingRecipe(r); setTempWeight(r.weight); }} className={`p-4 rounded-[2rem] ${glassStyle} flex gap-5 items-center active:scale-95 transition-all group`}>
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1">
                      <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none">{r.name}</h3>
                      <p className="text-[10px] font-black text-blue-500 mt-1 uppercase">{r.kcal} kcal • {r.time}</p>
                   </div>
                   <ChevronRight className="text-zinc-800" />
                </div>
              ))}
           </div>
        </section>

        {/* MODALE */}
        <AnimatePresence>
          {/* LISTA ZAKUPÓW */}
          {isShoppingListOpen && (
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[1100] bg-black h-screen flex flex-col p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Lista Zakupów</h2>
                <button onClick={() => setIsShoppingListOpen(false)} className="p-4 bg-white/5 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {shoppingList.length === 0 ? (
                  <div className="text-center py-20 opacity-20 uppercase font-black">Lista jest pusta</div>
                ) : (
                  shoppingList.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border border-white/5 animate-in slide-in-from-right-4">
                      <div className="flex items-center gap-3"><CheckCircle2 className="text-blue-500" size={18}/><span className="text-sm font-bold uppercase">{item}</span></div>
                      <button onClick={() => setShoppingList(s => s.filter(x => x !== item))}><Trash2 size={16} className="text-zinc-700"/></button>
                    </div>
                  ))
                )}
              </div>
              {shoppingList.length > 0 && (
                <button onClick={() => setShoppingList([])} className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest mt-4">Wyczyść wszystko</button>
              )}
            </motion.div>
          )}

          {/* DETALE PRZEPISU */}
          {(activeTab || viewingRecipe) && (
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[1000] bg-black h-screen flex flex-col overflow-hidden">
                <div className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-md shrink-0 border-b border-white/10">
                  <h2 className="text-2xl font-black italic uppercase">{viewingRecipe ? "Szczegóły" : "Produkty"}</h2>
                  <button onClick={() => {setActiveTab(null); setViewingRecipe(null);}} className="p-4 bg-white/5 rounded-full"><X/></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
                   {viewingRecipe ? (
                     <div className="space-y-8">
                        <div className="relative h-72 rounded-[3rem] overflow-hidden border border-white/10">
                          <img src={viewingRecipe.image} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <div className="absolute bottom-8 left-8">
                             <h3 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">{viewingRecipe.name}</h3>
                             <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{viewingRecipe.micros}</p>
                          </div>
                        </div>

                        {/* SKŁADNIKI */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center px-1">
                              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Składniki</h4>
                              <button 
                                onClick={() => addToShoppingList(viewingRecipe.ingredients)}
                                className="bg-blue-600 px-5 py-2 rounded-full text-[9px] font-black uppercase flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-blue-600/20"
                              >
                                <ListPlus size={14}/> Dodaj do listy zakupów
                              </button>
                           </div>
                           <div className="grid gap-2">
                              {viewingRecipe.ingredients.map((ing: string, i: number) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] font-bold uppercase flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {ing}
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* INSTRUKCJA */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2"><BookOpen size={16}/> Instrukcja ({viewingRecipe.time})</h4>
                          <p className="p-7 bg-zinc-900 rounded-[2.5rem] text-[13px] italic text-zinc-400 leading-relaxed border border-white/5">{viewingRecipe.steps}</p>
                        </div>

                        {/* DODAWANIE DO DZIENNIKA */}
                        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-8">
                          <div className="flex justify-between items-center px-6">
                            <button onClick={() => setTempWeight(w => Math.max(1, w-50))} className="p-5 bg-black rounded-full border border-white/10"><Minus/></button>
                            <span className="text-5xl font-black italic">{tempWeight}g</span>
                            <button onClick={() => setTempWeight(w => w+50)} className="p-5 bg-black rounded-full border border-white/10"><Plus/></button>
                          </div>
                          <button onClick={() => {
                            const final = calculateMacros(viewingRecipe, tempWeight);
                            setMeals((p: any) => ({...p, [selectedMealKey as string]: {...p[selectedMealKey as string], items: [...p[selectedMealKey as string].items, {...final, id: Date.now()}]}}));
                            setViewingRecipe(null); setActiveTab(null); toast({title: "Zapisano w dzienniku"});
                          }} className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-xs tracking-widest">Dodaj do dziennika</button>
                        </div>
                     </div>
                   ) : activeTab === "recipes" && (
                     <div className="space-y-4">
                        {RECIPES.map(r => (
                          <div key={r.id} onClick={() => { setViewingRecipe(r); setTempWeight(r.weight); }} className="p-6 bg-zinc-900 rounded-3xl border border-white/5 flex justify-between items-center active:scale-95 transition-all">
                            <p className="font-black uppercase italic tracking-tighter">{r.name}</p>
                            <Plus size={18} className="text-blue-600" />
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Diet;