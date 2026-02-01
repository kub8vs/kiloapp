import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, ScanLine, Dumbbell, Bike, ChefHat, TrendingUp, 
  Plus, X, Zap, Timer, MapPin, Flame, Clock, ShoppingCart 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import ProgressRing from '@/components/ui/ProgressRing';
import { 
  getUserProfile, getTodayStats, calculateDailyGoals, 
  isOnboardingCompleted, addToShoppingList 
} from '@/lib/user-store';

const weekDays = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile] = useState(getUserProfile());
  const [stats] = useState(getTodayStats());
  const [selectedDate] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('kiloapp_splash_played'));

  useEffect(() => {
    if (!isOnboardingCompleted()) navigate('/onboarding');
    if (showSplash) {
      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('kiloapp_splash_played', 'true');
      }, 2000);
    }
  }, [navigate, showSplash]);

  const goals = useMemo(() => profile ? calculateDailyGoals(profile) : null, [profile]);

  // Twoja baza przepisów (z dokładnymi opisami)
  const recipes = useMemo(() => [
    {
      title: "Omlet 'Syty Poranek'", kcal: 340, protein: 32, carbs: 12, fat: 18, time: "10 min", icon: "🍳",
      image: "https://images.unsplash.com/photo-1510629954389-c1e0da47d415?q=80&w=800",
      ingredients: [{ name: "Jaja (L)", amount: "3", unit: "szt" }, { name: "Twaróg", amount: "100", unit: "g" }, { name: "Szpinak", amount: "50", unit: "g" }],
      steps: ["🥣 Roztrzep jaja z twarogiem.", "🥬 Podduś szpinak na patelni.", "🔥 Wlej masę i smaż pod przykryciem 6 min."]
    },
    {
      title: "Bowl z Kurczakiem", kcal: 410, protein: 45, carbs: 35, fat: 8, time: "25 min", icon: "🥗",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
      ingredients: [{ name: "Pierś z kurczaka", amount: "200", unit: "g" }, { name: "Ryż", amount: "50", unit: "g" }, { name: "Brokuły", amount: "150", unit: "g" }],
      steps: ["🍚 Ugotuj ryż.", "🍗 Podsmaż kurczaka w przyprawach.", "🥦 Ugotuj brokuły i wymieszaj w misce."]
    }
  ], []);

  if (!profile || !goals) return null;

  return (
    <>
      <AnimatePresence>{showSplash && (
        <motion.div exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-foreground rounded-[2rem] flex items-center justify-center mb-4"><Dumbbell size={48} className="text-background" /></div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">KiloApp</h2>
          </div>
        </motion.div>
      )}</AnimatePresence>

      <AppLayout>
        <div className="px-5 pt-12 pb-24 space-y-6">
          <header className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm uppercase font-bold">{selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric' })}</p>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Cześć, {profile.name}!</h1>
            </div>
          </header>

          {/* DNI TYGODNIA */}
          <div className="flex justify-between">
            {weekDays.map((day, i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) ? 'bg-foreground text-background' : 'bg-card/40'}`}>{day}</div>
            ))}
          </div>

          {/* KROKI */}
          <div className="kilo-card bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center"><Footprints size={24} /></div>
              <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Kroki dzisiaj</p><p className="text-2xl font-black">{stats.steps}</p></div>
            </div>
            <ProgressRing progress={(stats.steps / goals.steps) * 100} size={50} strokeWidth={5}><span className="text-[10px] font-bold">{Math.round((stats.steps / goals.steps) * 100)}%</span></ProgressRing>
          </div>

          {/* MAKRO */}
          <div className="kilo-card bg-white/5 border border-white/10">
            <h3 className="font-black uppercase italic tracking-tighter mb-4 text-sm">Twoje Makro</h3>
            <div className="flex justify-around">
              {[{l:'B', v:stats.protein, m:goals.protein, c:'--kilo-protein'}, {l:'W', v:stats.carbs, m:goals.carbs, c:'--kilo-carbs'}, {l:'T', v:stats.fat, m:goals.fat, c:'--kilo-fat'}].map(m => (
                <div key={m.l} className="flex flex-col items-center">
                  <ProgressRing progress={(m.v / m.m) * 100} size={65} strokeWidth={5} color={`hsl(var(${m.c}))`}><span className="font-black">{m.l}</span></ProgressRing>
                  <p className="mt-2 text-xs font-bold text-muted-foreground">{m.v}g / {m.m}g</p>
                </div>
              ))}
            </div>
          </div>

          {/* SZYBKI DOSTĘP */}
          <div className="grid grid-cols-4 gap-3">
            {[ { i: ScanLine, l: 'Skanuj', p: '/diet' }, { i: Dumbbell, l: 'Trening', p: '/workout' }, { i: Bike, l: 'Cardio', p: '/workout' }, { i: ChefHat, l: 'Przepisy', p: '/diet' } ].map(a => (
              <button key={a.l} onClick={() => navigate(a.p)} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-white/5 flex items-center justify-center"><a.i size={24} /></div>
                <span className="text-[10px] text-muted-foreground uppercase font-black">{a.l}</span>
              </button>
            ))}
          </div>

          {/* PRZEPISY DLA CIEBIE */}
          <section>
            <h3 className="font-black uppercase italic tracking-tighter mb-4 text-sm">Wybrane dla Ciebie</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recipes.map((recipe, idx) => (
                <motion.div key={idx} onClick={() => setSelectedRecipe(recipe)} whileTap={{ scale: 0.95 }} className="min-w-[200px] bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3">
                  <div className="text-3xl">{recipe.icon}</div>
                  <h4 className="font-bold text-xs leading-tight h-8 line-clamp-2">{recipe.title}</h4>
                  <div className="flex gap-3 text-[9px] font-bold text-muted-foreground uppercase">
                    <span className="flex items-center gap-1"><Flame size={10} /> {recipe.kcal} kcal</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {recipe.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ANALIZA CIĘŻARU */}
          <div className="kilo-card bg-black/20 border border-white/5">
            <div className="flex items-center gap-2 mb-4"><TrendingUp size={18} className="text-primary" /><h3 className="font-black uppercase italic text-sm">Progres Siłowy</h3></div>
            <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] text-muted-foreground uppercase font-bold italic text-center px-6">Dodaj swój pierwszy trening,<br/>aby zobaczyć wykres progresu</p>
            </div>
          </div>
        </div>

        {/* MODAL PRZEPISU */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[150] bg-background overflow-y-auto">
              <div className="relative h-64"><img src={selectedRecipe.image} className="w-full h-full object-cover" /><button onClick={() => setSelectedRecipe(null)} className="absolute top-6 left-6 p-3 bg-black/50 rounded-full text-white"><X size={24} /></button></div>
              <div className="px-6 -mt-10 relative bg-background rounded-t-[3rem] pt-8 pb-12 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase italic">{selectedRecipe.title}</h2>
                  <div className="flex justify-center gap-4 text-[10px] font-bold">
                    <span className="text-primary tracking-widest uppercase">{selectedRecipe.protein}g BIAŁKA</span>
                    <span className="text-muted-foreground tracking-widest uppercase">{selectedRecipe.kcal} KCAL</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><h3 className="font-black uppercase text-xs italic">Składniki</h3><button onClick={() => { addToShoppingList(selectedRecipe.ingredients); alert("Dodano do listy!"); }} className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-[9px] font-black uppercase"><ShoppingCart size={12} /> Kup składniki</button></div>
                  {selectedRecipe.ingredients.map((ing: any, i: number) => (
                    <div key={i} className="flex justify-between p-4 bg-white/5 rounded-2xl text-xs font-bold"><span>{ing.name}</span><span className="text-primary">{ing.amount} {ing.unit}</span></div>
                  ))}
                </div>
                <div className="space-y-4 pb-10">
                  <h3 className="font-black uppercase text-xs italic">Przygotowanie</h3>
                  {selectedRecipe.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4"><div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div><p className="text-sm text-muted-foreground leading-relaxed">{step}</p></div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppLayout>
    </>
  );
};

export default Dashboard;