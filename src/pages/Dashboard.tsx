import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Footprints, 
  ScanLine, 
  Dumbbell, 
  Bike, 
  ChefHat,
  TrendingUp,
  Plus,
  X,
  Zap,
  Timer,
  MapPin 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import ProgressRing from '@/components/ui/ProgressRing';
import { 
  getUserProfile, 
  getTodayStats, 
  calculateDailyGoals,
  isOnboardingCompleted 
} from '@/lib/user-store';

const weekDays = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

const stravaActivities = [
  { id: 'gym', label: 'Siłownia', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'run', label: 'Bieganie', icon: Zap, color: 'bg-red-500' },
  { id: 'bike', label: 'Rower', icon: Bike, color: 'bg-blue-500' },
  { id: 'walk', label: 'Marsz', icon: MapPin, color: 'bg-green-500' },
  { id: 'elliptical', label: 'Orbitrek', icon: Timer, color: 'bg-purple-500' },
  { id: 'cardio', label: 'Kardio', icon: Zap, color: 'bg-yellow-500' },
];

const analysisData = [
  { dzien: '01.01', ciezar: 60 },
  { dzien: '05.01', ciezar: 62.5 },
  { dzien: '10.01', ciezar: 65 },
  { dzien: '15.01', ciezar: 65 },
  { dzien: '20.01', ciezar: 70 },
  { dzien: '25.01', ciezar: 72.5 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile] = useState(getUserProfile());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // LOGIKA JEDNORAZOWEJ ANIMACJI
  const [showSplash, setShowSplash] = useState(() => {
    // Sprawdzamy, czy w tej sesji animacja już była odtwarzana
    return !sessionStorage.getItem('kiloapp_splash_played');
  });
  
  useEffect(() => {
    if (!isOnboardingCompleted()) {
      navigate('/onboarding');
    }

    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        // Zapisujemy w pamięci sesji, że animacja już się odbyła
        sessionStorage.setItem('kiloapp_splash_played', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, showSplash]);

  const currentDayIndex = useMemo(() => {
    const day = selectedDate.getDay();
    return day === 0 ? 6 : day - 1;
  }, [selectedDate]);

  const goals = profile ? calculateDailyGoals(profile) : null;
  const stats = getTodayStats();

  // Wykres rysuje się po splashu (jeśli jest) LUB od razu jeśli splash już był grany
  const shouldAnimateChart = !showSplash && isInView;

  if (!profile || !goals) return null;

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.5, 1.1, 40],
                opacity: [0, 1, 0] 
              }}
              transition={{ duration: 1.8, times: [0, 0.5, 1], ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-foreground rounded-[2rem] flex items-center justify-center shadow-2xl mb-4">
                 <Dumbbell size={48} className="text-background" />
              </div>
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">KiloApp</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AppLayout>
        <motion.div 
          initial={showSplash ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="px-5 pt-12 pb-24 space-y-6 relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <p className="text-muted-foreground capitalize text-sm">
                {selectedDate.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="text-3xl font-bold mt-1 tracking-tight">Cześć, {profile.name}!</h1>
            </motion.div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAddingActivity(true)}
              className="w-12 h-12 bg-foreground text-background rounded-full flex items-center justify-center shadow-xl"
            >
              <Plus size={28} />
            </motion.button>
          </div>

          {/* Dni tygodnia */}
          <div className="flex justify-between items-center py-2">
            {weekDays.map((day, index) => (
              <button
                key={index}
                onClick={() => {
                  const newDate = new Date();
                  const diff = index - (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
                  newDate.setDate(new Date().getDate() + diff);
                  setSelectedDate(newDate);
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index === currentDayIndex 
                    ? 'bg-foreground text-background scale-110 shadow-lg' 
                    : 'bg-card/40 text-muted-foreground'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Kroki */}
          <div className="kilo-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <Footprints size={28} />
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Kroki</p>
                  <p className="text-3xl font-black">
                    {stats.steps.toLocaleString()}
                    <span className="text-sm text-muted-foreground font-normal ml-1">/{goals.steps.toLocaleString()}</span>
                  </p>
                </div>
              </div>
              <ProgressRing progress={(stats.steps / goals.steps) * 100} size={60} strokeWidth={6}>
                <span className="text-xs font-black">{Math.round((stats.steps / goals.steps) * 100)}%</span>
              </ProgressRing>
            </div>
          </div>

          {/* Makro */}
          <div className="kilo-card bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg uppercase tracking-tighter">Makroskładniki</h3>
              <div className="px-3 py-1 bg-foreground/10 rounded-full text-xs font-bold">
                {stats.calories}/{goals.calories} kcal
              </div>
            </div>
            <div className="flex justify-around">
              {[{l:'B', v:stats.protein, m:goals.protein, c:'--kilo-protein'}, {l:'W', v:stats.carbs, m:goals.carbs, c:'--kilo-carbs'}, {l:'T', v:stats.fat, m:goals.fat, c:'--kilo-fat'}].map((m) => (
                <div key={m.l} className="flex flex-col items-center">
                  <ProgressRing progress={(m.v / m.m) * 100} size={70} strokeWidth={5} color={`hsl(var(${m.c}))`}>
                    <span className="text-xs font-black">{m.l}</span>
                  </ProgressRing>
                  <p className="mt-3 text-sm font-bold">{m.v}g</p>
                </div>
              ))}
            </div>
          </div>

          {/* Szybki dostęp */}
          <div className="grid grid-cols-4 gap-3 pt-2">
            {[
              { icon: ScanLine, label: 'Skanuj', path: '/diet' },
              { icon: Dumbbell, label: 'Trening', path: '/workout' },
              { icon: Bike, label: 'Cardio', path: '/workout?tab=cardio' },
              { icon: ChefHat, label: 'Przepisy', path: '/diet?tab=recipes' },
            ].map((action) => (
              <button key={action.label} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-2 group">
                <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-white/5 flex items-center justify-center group-active:scale-90 transition-all">
                  <action.icon size={26} />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Wykres */}
          <motion.div 
            initial={showSplash ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            whileInView={{ opacity: 1, y: 0 }}
            onViewportEnter={() => setIsInView(true)}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="kilo-card bg-black/40 border border-white/5 shadow-2xl space-y-4"
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              <h3 className="font-bold text-lg uppercase tracking-tighter">Analiza Ciężaru</h3>
            </div>
            <div className="h-[200px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysisData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="dzien" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#666'}} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="ciezar" 
                    stroke="#fff" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#fff' }}
                    isAnimationActive={shouldAnimateChart}
                    animationDuration={2500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Modal Aktywności */}
          <AnimatePresence>
            {isAddingActivity && (
              <motion.div 
                initial={{ opacity: 0, y: '100%' }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: '100%' }} 
                className="fixed inset-0 z-[110] bg-background p-6 flex flex-col"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Zapisz sesję</h2>
                  <button onClick={() => setIsAddingActivity(false)} className="p-3 bg-card rounded-full"><X size={28} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {stravaActivities.map((act) => (
                    <button 
                      key={act.id} 
                      onClick={() => { setIsAddingActivity(false); navigate(act.id === 'gym' ? '/workout' : `/workout?type=${act.id}`); }} 
                      className="p-8 bg-card rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4 active:scale-95"
                    >
                      <div className={`w-14 h-14 ${act.color} rounded-full flex items-center justify-center text-white shadow-2xl`}><act.icon size={28} /></div>
                      <span className="font-black text-xs uppercase tracking-widest">{act.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AppLayout>
    </>
  );
};

export default Dashboard;