import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, ScanLine, Dumbbell, Bike, ChefHat, TrendingUp, 
  X, Zap, Timer, MapPin, Flame, Clock,
  BrainCircuit, Send, MessageSquare, ChevronLeft 
} from 'lucide-react';

// --- DODANE IMPORTY FIREBASE ---
import { auth } from '@/lib/firebase';
import { signInAnonymously } from 'firebase/auth';

import AppLayout from '@/components/layout/AppLayout';
import ProgressRing from '@/components/ui/ProgressRing';
import { 
  getUserProfile, getTodayStats, calculateDailyGoals, 
  isOnboardingCompleted 
} from '@/lib/user-store';
import { askTrainer } from '@/lib/gemini';

const weekDays = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

const TRAINERS = [
  { id: 'kamil', name: 'Kamil', role: 'Ekspert Siły', color: 'blue' },
  { id: 'marta', name: 'Marta', role: 'Specjalistka Redukcji', color: 'emerald' },
  { id: 'seba', name: 'Seba', role: 'Motywator Elite', color: 'orange' }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile] = useState(() => getUserProfile());
  const [stats] = useState(() => getTodayStats());
  const [selectedDate] = useState(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('kiloapp_splash_played'));

  // --- STANY AI ---
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{role: string, text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // --- DODANY EFFECT DO LOGOWANIA ANONIMOWEGO ---
  useEffect(() => {
    if (!auth.currentUser) {
      signInAnonymously(auth)
        .then(() => console.log("Połączono z Firebase (Elite Anonymous Mode)"))
        .catch((err) => console.error("Błąd połączenia z bazą:", err));
    }
  }, []);
  
  useEffect(() => {
    if (!isOnboardingCompleted()) {
      navigate('/onboarding');
      return;
    }
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('kiloapp_splash_played', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSplash]);

  useEffect(() => {
    if (selectedTrainer || selectedRecipe) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedTrainer, selectedRecipe]);

  const goals = useMemo(() => profile ? calculateDailyGoals(profile) : null, [profile]);

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

  const handleSendAI = async () => {
    if (!message.trim() || isTyping) return;
    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await askTrainer(selectedTrainer.role, userMsg);
      setChat(prev => [...prev, { role: 'ai', text: response }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'ai', text: "Elite błąd połączenia. Spróbuj za chwilę." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!profile || !goals) return null;

  return (
    <>
      <AnimatePresence>{showSplash && (
        <motion.div 
          key="splash"
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-foreground rounded-[2rem] flex items-center justify-center mb-4">
              <Dumbbell size={48} className="text-background" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">KiloApp</h2>
          </div>
        </motion.div>
      )}</AnimatePresence>

      <AppLayout>
        <div className="px-5 pt-12 pb-24 space-y-6">
          <header className="flex justify-between items-start">
            <div>
              <p className="text-muted-foreground text-sm uppercase font-bold">
                {selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric' })}
              </p>
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">Cześć, {profile.name}!</h1>
            </div>
          </header>

          <div className="flex justify-between">
            {weekDays.map((day, i) => {
              const today = new Date().getDay();
              const adjustedToday = today === 0 ? 6 : today - 1;
              return (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${i === adjustedToday ? 'bg-foreground text-background' : 'bg-card/40'}`}>
                  {day}
                </div>
              );
            })}
          </div>

          <div className="kilo-card bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center"><Footprints size={24} /></div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Kroki dzisiaj</p>
                <p className="text-2xl font-black">{stats.steps || 0}</p>
              </div>
            </div>
            <ProgressRing 
              progress={goals.steps > 0 ? ((stats.steps || 0) / goals.steps) * 100 : 0} 
              size={50} 
              strokeWidth={5}
            >
              <span className="text-[10px] font-bold">
                {goals.steps > 0 ? Math.round(((stats.steps || 0) / goals.steps) * 100) : 0}%
              </span>
            </ProgressRing>
          </div>

          <div className="kilo-card bg-white/5 border border-white/10">
            <h3 className="font-black uppercase italic tracking-tighter mb-4 text-sm">Twoje Makro</h3>
            <div className="flex justify-around">
              {[
                {l:'B', v:stats.protein, m:goals.protein, c:'--kilo-protein'}, 
                {l:'W', v:stats.carbs, m:goals.carbs, c:'--kilo-carbs'}, 
                {l:'T', v:stats.fat, m:goals.fat, c:'--kilo-fat'}
              ].map(m => (
                <div key={m.l} className="flex flex-col items-center">
                  <ProgressRing 
                    progress={m.m > 0 ? ((m.v || 0) / m.m) * 100 : 0} 
                    size={65} 
                    strokeWidth={5} 
                    color={`hsl(var(${m.c}))`}
                  >
                    <span className="font-black">{m.l}</span>
                  </ProgressRing>
                  <p className="mt-2 text-xs font-bold text-muted-foreground">
                    {m.v || 0}g / {m.m}g
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[ 
              { i: ScanLine, l: 'Skanuj', p: '/diet' }, 
              { i: Dumbbell, l: 'Trening', p: '/workout' }, 
              { i: Bike, l: 'Cardio', p: '/workout' }, 
              { i: ChefHat, l: 'Przepisy', p: '/diet' } 
            ].map(a => (
              <button key={a.l} onClick={() => navigate(a.p)} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-white/5 flex items-center justify-center"><a.i size={24} /></div>
                <span className="text-[10px] text-muted-foreground uppercase font-black">{a.l}</span>
              </button>
            ))}
          </div>

          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-1 flex items-center gap-2">
              <BrainCircuit size={14} /> AI Elite Trainers
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {TRAINERS.map(t => (
                <button 
                  key={t.id}
                  onClick={() => { setSelectedTrainer(t); setChat([]); }}
                  className="flex-shrink-0 bg-white/5 border border-white/10 p-4 rounded-[2rem] flex items-center gap-3 active:scale-95 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-primary">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase italic leading-none">{t.name}</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter mt-1">{t.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-black uppercase italic tracking-tighter mb-4 text-sm">Wybrane dla Ciebie</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {recipes.map((recipe, idx) => (
                <motion.div 
                  key={idx} 
                  onClick={() => setSelectedRecipe(recipe)} 
                  whileTap={{ scale: 0.95 }} 
                  className="min-w-[200px] bg-white/5 border border-white/10 rounded-[2rem] p-5 space-y-3 cursor-pointer"
                >
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

          <div className="kilo-card bg-black/20 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-primary" />
              <h3 className="font-black uppercase italic text-sm">Progres Siłowy</h3>
            </div>
            <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] text-muted-foreground uppercase font-bold italic text-center px-6">
                Dodaj swój pierwszy trening,<br/>aby zobaczyć wykres progresu
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedRecipe && (
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              className="fixed inset-0 z-[150] bg-background overflow-y-auto"
            >
              <div className="relative h-64">
                <img src={selectedRecipe.image} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setSelectedRecipe(null)} className="absolute top-6 left-6 p-3 bg-black/50 rounded-full text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="px-6 -mt-10 relative bg-background rounded-t-[3rem] pt-8 pb-12 space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black uppercase italic">{selectedRecipe.title}</h2>
                  <div className="flex justify-center gap-4 text-[10px] font-bold">
                    <span className="text-primary tracking-widest uppercase">{selectedRecipe.protein}g BIAŁKA</span>
                    <span className="text-muted-foreground tracking-widest uppercase">{selectedRecipe.kcal} KCAL</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black uppercase text-xs italic">Składniki</h3>
                  {selectedRecipe.ingredients.map((ing: any, i: number) => (
                    <div key={i} className="flex justify-between p-4 bg-white/5 rounded-2xl text-xs font-bold">
                      <span>{ing.name}</span>
                      <span className="text-primary">{ing.amount} {ing.unit}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pb-10">
                  <h3 className="font-black uppercase text-xs italic">Przygotowanie</h3>
                  {selectedRecipe.steps.map((step: string, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedTrainer && (
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              className="fixed inset-0 z-[700] bg-background p-6 flex flex-col"
            >
              <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedTrainer(null)} className="p-2 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                  </button>
                  <div>
                    <h2 className="font-black uppercase italic text-xl leading-none">{selectedTrainer.name}</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mt-1">{selectedTrainer.role}</p>
                  </div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl text-primary"><MessageSquare /></div>
              </header>

              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-hide">
                {chat.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-20">
                    <Zap size={48} className="mb-4" />
                    <p className="text-xs font-black uppercase italic">Zadaj pytanie swojemu trenerowi</p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm font-bold ${msg.role === 'user' ? 'bg-foreground text-background rounded-tr-none' : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && <div className="text-[10px] font-black text-primary animate-pulse uppercase italic">Analiza Elite Pro...</div>}
              </div>

              <div className="relative pb-10">
                <input 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAI()}
                  placeholder="Napisz do trenera..."
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none font-bold text-sm focus:border-primary transition-all pr-14"
                />
                <button 
                  onClick={handleSendAI}
                  disabled={isTyping}
                  className={`absolute right-2 top-2 w-11 h-11 bg-foreground text-background rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-lg ${isTyping ? 'opacity-50' : ''}`}
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AppLayout>
    </>
  );
};

export default Dashboard;