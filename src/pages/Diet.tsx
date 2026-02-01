import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Webcam from "react-webcam";
import { 
  Camera, X, Loader2, Sparkles, Plus, Minus, BookOpen, Trash2, 
  ShoppingCart, ChevronRight, Info, Droplets, Zap, CheckCircle2
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

const glassStyle = "bg-zinc-900/50 backdrop-blur-xl border border-white/10 shadow-2xl";

// --- GIGANTYCZNA BAZA PRZEPISÓW (10 PEŁNYCH POZYCJI) ---
const RECIPES = [
  { 
    id: 1, name: "Pancakes Proteinowe", cat: "Śniadanie", kcal: 450, p: 35, c: 45, f: 10, weight: 250,
    ingredients: ["2 jajka", "30g odżywki białkowej", "1 banan", "40g płatków owsianych", "5g oleju kokosowego"],
    steps: "1. Zblenduj jajka, banan, odżywkę i płatki na gładką masę. 2. Rozgrzej patelnię z kroplą oleju. 3. Smaż małe placki przez ok. 2 minuty z każdej strony na małym ogniu."
  },
  { 
    id: 2, name: "Bowl z Pieczonym Łososiem", cat: "Obiad", kcal: 620, p: 40, c: 55, f: 28, weight: 400,
    ingredients: ["150g łososia", "100g ryżu basmati", "50g awokado", "Garść edamame", "Sos sojowy"],
    steps: "1. Łososia przypraw i piecz w 200°C przez 12-15 min. 2. Ugotuj ryż według instrukcji. 3. Wyłóż wszystko do miski, dodaj pokrojone awokado i fasolkę edamame. Skrop sosem."
  },
  { 
    id: 3, name: "Szakszuka z Fetą", cat: "Śniadanie", kcal: 380, p: 22, c: 15, f: 25, weight: 350,
    ingredients: ["3 jajka", "200g pomidorów z puszki", "30g sera feta", "Cebula", "Czosnek", "Oliwa"],
    steps: "1. Na oliwie podsmaż cebulę i czosnek. 2. Wlej pomidory i duś, aż sos zgęstnieje. 3. Zrób wgłębienia, wbij jajka i gotuj pod przykryciem, aż białka się ściną. Posyp fetą."
  },
  { 
    id: 4, name: "Kurczak Curry z Mango", cat: "Obiad", kcal: 550, p: 48, c: 60, f: 12, weight: 450,
    ingredients: ["180g piersi z kurczaka", "50g ryżu", "100ml mleczka kokosowego light", "Pół mango", "Pasta curry"],
    steps: "1. Kurczaka pokrój w kostkę i podsmaż z pastą curry. 2. Wlej mleczko kokosowe i gotuj 5 min. 3. Na koniec dodaj pokrojone mango i podawaj z ugotowanym ryżem."
  },
  { 
    id: 5, name: "Tofu Stir-Fry", cat: "Kolacja", kcal: 410, p: 28, c: 42, f: 15, weight: 380,
    ingredients: ["180g tofu twardego", "Mix warzyw mrożonych", "30g makaronu ryżowego", "Imbir", "Sezam"],
    steps: "1. Tofu pokrój w kostkę i podsmaż na mocnym ogniu, aż będzie chrupiące. 2. Dodaj warzywa i starty imbir, smaż 5 min. 3. Wymieszaj z ugotowanym makaronem i posyp sezamem."
  },
  { 
    id: 6, name: "Serek Wiejski na Słodko", cat: "Przekąski", kcal: 320, p: 28, c: 30, f: 10, weight: 300,
    ingredients: ["200g serka wiejskiego", "15g masła orzechowego", "Garść borówek", "10g migdałów"],
    steps: "1. Przełóż serek do miseczki. 2. Dodaj masło orzechowe (możesz lekko podgrzać, by było płynne). 3. Posyp owocami i posiekanymi migdałami."
  },
  { 
    id: 7, name: "Wrap z Wołowiną", cat: "Kolacja", kcal: 490, p: 38, c: 45, f: 18, weight: 280,
    ingredients: ["1 placek tortilli", "120g mielonej wołowiny chudej", "Papryka", "Czerwona fasola", "Jogurt naturalny"],
    steps: "1. Wołowinę podsmaż z przyprawą do taco i fasolą. 2. Nałóż mięso na tortillę, dodaj świeżą paprykę. 3. Polij jogurtem i zwiń ciasno."
  },
  { 
    id: 8, name: "Sałatka Cezar Elite", cat: "Kolacja", kcal: 440, p: 42, c: 12, f: 24, weight: 320,
    ingredients: ["150g kurczaka", "Sałata rzymska", "15g parmezanu", "1 kromka chleba na grzanki", "Sos jogurtowo-czosnkowy"],
    steps: "1. Kurczaka zgrilluj i pokrój w paski. 2. Sałatę wymieszaj z sosem. 3. Dodaj kurczaka, płatki parmezanu i zrobione na patelni grzanki."
  },
  { 
    id: 9, name: "Owsianka Nocna Brownie", cat: "Śniadanie", kcal: 510, p: 32, c: 65, f: 14, weight: 350,
    ingredients: ["50g płatków owsianych", "20g odżywki czekoladowej", "10g kakao", "150ml mleka roślinnego", "Nasiona chia"],
    steps: "1. Wszystkie składniki wymieszaj w słoiku. 2. Wstaw do lodówki na minimum 6 godzin (najlepiej na noc). 3. Rano wymieszaj, możesz dodać orzechy."
  },
  { 
    id: 10, name: "Stek z Kalafiora (Wege)", cat: "Obiad", kcal: 350, p: 15, c: 35, f: 18, weight: 450,
    ingredients: ["1 duży plaster kalafiora", "50g hummusu", "Granat", "Oliwa", "Kumin"],
    steps: "1. Kalafiora posmaruj oliwą z kuminem i piecz 25 min w 200°C. 2. Wyłóż na talerz posmarowany hummusem. 3. Posyp obficie pestkami granatu."
  }
];

const Diet = () => {
  const { toast } = useToast();
  
  // --- STATE: POSIŁKI ---
  const [meals, setMeals] = useState({
    breakfast: { name: "Śniadanie", items: [] },
    lunch: { name: "Obiad", items: [] },
    dinner: { name: "Kolacja", items: [] },
    snacks: { name: "Przekąski", items: [] },
  });

  // --- STATE: LISTA ZAKUPÓW ---
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);

  // --- STATE: UI & SKANER ---
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [activeTab, setActiveTab] = useState<"recipes" | "scanner" | null>(null);
  const [selectedMealKey, setSelectedMealKey] = useState<string | null>(null);
  const [viewingRecipe, setViewingRecipe] = useState<any>(null);
  const [tempWeight, setTempWeight] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // --- LOGIKA MAKRO ---
  const dayTotals = useMemo(() => {
    let kcal = 0, p = 0, c = 0, f = 0;
    Object.values(meals).forEach(m => m.items.forEach((i: any) => {
      kcal += i.kcal; p += i.p; c += i.c; f += i.f;
    }));
    return { kcal, p, c, f };
  }, [meals]);

  const calculateMacros = (item: any, newWeight: number) => {
    const factor = newWeight / (item.weight || 100);
    return {
      ...item,
      kcal: Math.round(item.kcal * factor),
      p: Math.round(item.p * factor),
      c: Math.round(item.c * factor),
      f: Math.round(item.f * factor),
      weight: newWeight
    };
  };

  // --- FUNKCJE LISTY ZAKUPÓW ---
  const addToShoppingList = (items: string[]) => {
    setShoppingList(prev => [...new Set([...prev, ...items])]);
    toast({ 
      title: "Zaktualizowano listę", 
      description: `Dodano ${items.length} składników.`,
      variant: "default"
    });
  };

  const removeFromShoppingList = (item: string) => {
    setShoppingList(prev => prev.filter(i => i !== item));
  };

  // --- PROTIPY DYNAMICZNE ---
  const getProTip = () => {
    if (waterGlasses < 4) return "Pamiętaj o nawodnieniu! Twoje tempo spalania tłuszczu zależy od poziomu wody w organizmie.";
    if (dayTotals.p < 100) return "Dziś masz mało białka. Dodaj twaróg lub odżywkę do kolacji, by chronić mięśnie.";
    return "Świetna robota! Trzymasz idealne proporcje makroskładników.";
  };

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-32 space-y-8 bg-black min-h-screen text-white">
        
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">DIETA</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Kilo Elite AI</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsShoppingListOpen(true)}
              className="relative p-4 bg-zinc-900 border border-white/10 rounded-2xl active:scale-90 transition-all"
            >
              <ShoppingCart size={20} />
              {shoppingList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-black">
                  {shoppingList.length}
                </span>
              )}
            </button>
            <button onClick={() => { setSelectedMealKey("breakfast"); setActiveTab("scanner"); }} className="p-4 bg-blue-600 rounded-2xl shadow-lg active:scale-90">
              <Camera size={20} />
            </button>
          </div>
        </header>

        {/* STATYSTYKI BTW */}
        <section className={`p-8 rounded-[2.5rem] ${glassStyle}`}>
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-zinc-500">Pozostało</p>
              <h2 className="text-5xl font-black italic tracking-tighter">{Math.max(0, 2500 - dayTotals.kcal)} <span className="text-sm opacity-20">kcal</span></h2>
            </div>
            <Zap className="text-yellow-500 mb-1" size={24} fill="currentColor" />
          </div>
          <div className="grid grid-cols-3 gap-3">
             {[{l: "Białko", v: dayTotals.p, t: 180, c: "text-blue-500"}, {l: "Węgle", v: dayTotals.c, t: 250, c: "text-emerald-500"}, {l: "Tłuszcze", v: dayTotals.f, t: 70, c: "text-orange-500"}].map(m => (
               <div key={m.l} className="bg-white/5 p-3 rounded-2xl border border-white/5">
                 <p className={`text-[8px] font-black uppercase ${m.c} mb-1`}>{m.l}</p>
                 <p className="text-sm font-black italic">{m.v}g</p>
               </div>
             ))}
          </div>
        </section>

        {/* PROTIPY AI */}
        <section className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-[2rem] flex gap-4 items-center">
           <div className="p-3 bg-blue-500 rounded-2xl text-white shadow-lg"><Info size={20}/></div>
           <p className="text-[11px] text-zinc-400 leading-snug italic font-medium">"{getProTip()}"</p>
        </section>

        {/* DZIENNIK POSIŁKÓW */}
        <section className="space-y-4">
          <h2 className="text-xs font-black uppercase text-zinc-600 px-1 italic tracking-widest">Dziennik Dzisiaj</h2>
          {Object.entries(meals).map(([key, meal]) => (
            <div key={key} className={`p-6 rounded-[2.2rem] ${glassStyle} space-y-4`}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase italic tracking-tighter">{meal.name}</h3>
                <span className="text-xs font-black text-zinc-500">{meal.items.reduce((a, b: any) => a + b.kcal, 0)} kcal</span>
              </div>
              <div className="space-y-2">
                {meal.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group transition-all">
                    <div>
                      <p className="text-[10px] font-black uppercase">{item.name}</p>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase">{item.weight}g • B:{item.p}g</p>
                    </div>
                    <button onClick={() => setMeals(prev => ({...prev, [key]: {...meal, items: meal.items.filter((i:any)=>i.id !== item.id)}}))} className="p-2 text-zinc-800 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
              <button onClick={() => { setSelectedMealKey(key); setActiveTab("recipes"); }} className="w-full py-4 border border-dashed border-zinc-800 rounded-2xl text-[9px] font-black uppercase text-zinc-600 flex items-center justify-center gap-2">
                <Plus size={12} /> Dodaj produkt
              </button>
            </div>
          ))}
        </section>

        {/* NAWADNIANIE */}
        <section className={`p-6 rounded-[2rem] ${glassStyle} space-y-4`}>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-[10px] tracking-widest"><Droplets size={16}/> Nawodnienie</div>
             <span className="text-xs font-black">{waterGlasses * 250} ml / 3L</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[...Array(12)].map((_, i) => (
              <button key={i} onClick={() => setWaterGlasses(i+1)} className={`w-6 h-8 rounded-md border-2 transition-all ${i < waterGlasses ? 'bg-blue-500 border-blue-400' : 'border-zinc-800'}`} />
            ))}
          </div>
        </section>

        {/* PRZEPISY (EKSPLORACJA) */}
        <section className="space-y-4 pt-4">
           <h2 className="text-xs font-black uppercase text-zinc-600 px-1 italic">Eksploruj Kuchnię</h2>
           <div className="grid gap-4">
              {RECIPES.map(r => (
                <div key={r.id} onClick={() => { setViewingRecipe(r); setTempWeight(r.weight); }} className={`p-6 rounded-[2.5rem] ${glassStyle} flex justify-between items-center active:scale-95 transition-all`}>
                   <div>
                      <h3 className="text-lg font-black uppercase italic tracking-tighter">{r.name}</h3>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">{r.kcal} kcal | B: {r.p}g</p>
                   </div>
                   <ChevronRight className="text-zinc-800" />
                </div>
              ))}
           </div>
        </section>

        {/* MODAL: LISTA ZAKUPÓW */}
        <AnimatePresence>
          {isShoppingListOpen && (
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-[800] bg-black p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black italic uppercase">Lista Zakupów</h2>
                <button onClick={() => setIsShoppingListOpen(false)} className="p-4 bg-white/5 rounded-full"><X/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                {shoppingList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                    <ShoppingCart size={48} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Twoja lista jest pusta</p>
                  </div>
                ) : (
                  shoppingList.map((item, i) => (
                    <div key={i} className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-blue-500" size={18} />
                        <span className="text-sm font-bold uppercase">{item}</span>
                      </div>
                      <button onClick={() => removeFromShoppingList(item)} className="text-zinc-700"><Trash2 size={16}/></button>
                    </div>
                  ))
                )}
              </div>
              {shoppingList.length > 0 && (
                <button onClick={() => setShoppingList([])} className="w-full py-6 bg-red-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest mt-4">Wyczyść listę</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: PRZEPIS / SKANER / GRAMATURA */}
        <AnimatePresence>
          {(activeTab || viewingRecipe) && (
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed inset-0 z-[750] bg-black p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic uppercase">{viewingRecipe ? "Szczegóły" : "Wybierz źródło"}</h2>
                <button onClick={() => {setActiveTab(null); setViewingRecipe(null);}} className="p-4 bg-white/5 rounded-full"><X/></button>
              </div>

              {viewingRecipe ? (
                <div className="space-y-8 pb-32">
                   <div className="p-8 bg-zinc-900 rounded-[3rem] border border-white/5 text-center">
                      <h3 className="text-4xl font-black uppercase italic mb-4">{viewingRecipe.name}</h3>
                      <div className="flex justify-center gap-6 text-[10px] font-black uppercase text-zinc-500">
                        <span>Kcal: {viewingRecipe.kcal}</span>
                        <span>Waga: {viewingRecipe.weight}g</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600">Składniki</h4>
                        <button onClick={() => addToShoppingList(viewingRecipe.ingredients)} className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-[9px] font-black uppercase"><ShoppingCart size={12}/> Dodaj do listy</button>
                      </div>
                      <div className="grid gap-2">
                        {viewingRecipe.ingredients.map((ing: string, i: number) => (
                          <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-bold uppercase">{ing}</div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-600">Przygotowanie</h4>
                      <p className="p-6 bg-zinc-900 rounded-3xl text-sm italic text-zinc-400 border border-white/5 leading-relaxed">{viewingRecipe.steps}</p>
                   </div>

                   <div className="bg-white/5 p-8 rounded-[3rem] space-y-6">
                      <p className="text-center text-[10px] font-black text-zinc-500 uppercase">Zmień porcję do dziennika</p>
                      <div className="flex justify-between items-center px-4">
                        <button onClick={() => setTempWeight(w => Math.max(1, w-50))} className="p-4 bg-black rounded-full border border-white/10"><Minus/></button>
                        <span className="text-4xl font-black italic">{tempWeight}g</span>
                        <button onClick={() => setTempWeight(w => w+50)} className="p-4 bg-black rounded-full border border-white/10"><Plus/></button>
                      </div>
                      <button onClick={() => {
                        const final = calculateMacros(viewingRecipe, tempWeight);
                        setMeals(prev => ({...prev, [selectedMealKey!]: {...prev[selectedMealKey as keyof typeof meals], items: [...prev[selectedMealKey as keyof typeof meals].items, {...final, id: Date.now()}]}}));
                        setViewingRecipe(null); setActiveTab(null); toast({title: "Dodano do dziennika"});
                      }} className="w-full py-6 bg-white text-black rounded-[2rem] font-black uppercase text-[10px] tracking-widest">Dodaj do {meals[selectedMealKey as keyof typeof meals].name}</button>
                   </div>
                </div>
              ) : activeTab === "scanner" ? (
                <div className="flex flex-col items-center">
                   <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden border border-white/10 mb-8">
                      <Webcam ref={webcamRef} videoConstraints={{ facingMode: "environment" }} className="h-full w-full object-cover" />
                      <button 
                        onClick={() => { setIsAnalyzing(true); setTimeout(() => { setViewingRecipe({name: "Skanowany Posiłek", kcal: 380, p: 30, c: 40, f: 12, weight: 100, ingredients: ["Skanowane danie"], steps: "Brak instrukcji."}); setIsAnalyzing(false); }, 1500); }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-black"
                      >
                        {isAnalyzing ? <Loader2 className="animate-spin text-black" /> : <div className="w-16 h-16 border-2 border-black rounded-full" />}
                      </button>
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                   {RECIPES.map(r => (
                     <div key={r.id} onClick={() => setViewingRecipe(r)} className="p-6 bg-zinc-900 rounded-3xl border border-white/5 flex justify-between items-center active:scale-95 transition-all">
                        <p className="font-black uppercase italic">{r.name}</p>
                        <Plus size={18} className="text-blue-500" />
                     </div>
                   ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default Diet;