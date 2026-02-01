import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Zap, History as HistoryIcon, Plus, Play, X, Check,
  ChevronRight, Video, Search, Trash2, Edit3, Save, Timer, 
  MapPin, Activity, Coffee, BrainCircuit, Navigation, Pause, 
  FolderPlus, TrendingUp, MoreHorizontal, Award, Calendar, Info
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { 
  getWorkoutRoutines, getWorkoutHistory, addToHistory, 
  deleteHistoryItem, clearHistory, saveRoutine, deleteRoutine
} from '@/lib/user-store';

// --- GIGANTYCZNA BAZA ĆWICZEŃ (10 NA KAŻDĄ PARTIĘ) ---
const EXERCISE_DB = [
  // KLATKA PIERSIOWA (Chest)
  { id: 'ch1', name: 'Wyciskanie Sztangi (Płaska)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch2', name: 'Wyciskanie Hantli (Płaska)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch3', name: 'Wyciskanie Hantli (Skos Dodatni)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch4', name: 'Wyciskanie Sztangi (Skos Dodatni)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch5', name: 'Rozpiętki z Hantlami', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch6', name: 'Pec Deck (Maszyna)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch7', name: 'Dipy (Klatkowe)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch8', name: 'Wyciskanie na Maszynie Hammer', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch9', name: 'Krzyżowanie Linek Wyciągu (Góra)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ch10', name: 'Pompki Klasyczne', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },

  // PLECY (Back)
  { id: 'bk1', name: 'Podciąganie na Drążku (Nachwyt)', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk2', name: 'Wiosłowanie Sztangą w opadzie', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk3', name: 'Wiosłowanie Hantlem', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk4', name: 'Ściąganie drążka wyciągu górnego', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk5', name: 'Przyciąganie uchwytu wyciągu dolnego', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk6', name: 'Martwy Ciąg Klasyczny', muscle: 'Plecy/Nogi', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk7', name: 'Narciarz (Pullover na wyciągu)', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk8', name: 'Wiosłowanie na Maszynie', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk9', name: 'Podciąganie końca sztangi (T-Bar)', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },
  { id: 'bk10', name: 'Unoszenie Tułowia (Rzymska)', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif' },

  // NOGI (Legs)
  { id: 'lg1', name: 'Przysiady ze Sztangą (Back Squat)', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg2', name: 'Wypychanie na Suwnicy (Leg Press)', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg3', name: 'Martwy Ciąg Rumuński (RDL)', muscle: 'Nogi/Plecy', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg4', name: 'Wykroki Chodzone', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg5', name: 'Przysiad Bułgarski', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg6', name: 'Prostowanie nóg na maszynie', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg7', name: 'Uginanie nóg leżąc', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg8', name: 'Uginanie nóg siedząc', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg9', name: 'Wspięcia na palce stojąc', muscle: 'Łydki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'lg10', name: 'Hack Przysiad', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },

  // BARKI (Shoulders)
  { id: 'sh1', name: 'Wyciskanie Żołnierskie (OHP)', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh2', name: 'Wznosy hantli bokiem', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh3', name: 'Wyciskanie Hantli nad głowę', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh4', name: 'Facepulls', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh5', name: 'Arnoldki', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh6', name: 'Wznosy hantli w przód', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh7', name: 'Podciąganie sztangi do brody', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh8', name: 'Reverse Fly (Maszyna)', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh9', name: 'Wyciskanie na barki (Smith)', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'sh10', name: 'Wznosy linek wyciągu bokiem', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },

  // BICEPS & TRICEPS (Arms)
  { id: 'arm1', name: 'Uginanie ramion ze sztangą', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm2', name: 'Uginanie ramion hantlami (Młotkowe)', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm3', name: 'Modlitewnik (Maszyna/Sztanga)', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm4', name: 'Uginanie na wyciągu dolnym', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm5', name: 'Uginanie ramion w oparciu o kolano', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm6', name: 'Prostowanie na wyciągu (Linki)', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm7', name: 'Wyciskanie francuskie (Sztanga EZ)', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm8', name: 'Wyciskanie wąskie (Sztanga)', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm9', name: 'Dipy na poręczach (Tricepsowe)', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'arm10', name: 'Kickbacks (Hantlem w opadzie)', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },

  // BRZUCH (Core)
  { id: 'ab1', name: 'Unoszenie nóg w zwisie', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab2', name: 'Brzuszki (Crunches)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab3', name: 'Plank (Deska)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab4', name: 'Allahy (Wyciąg górny)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab5', name: 'Rowerek (Bicycle Crunches)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab6', name: 'Russian Twist (Rotacja)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab7', name: 'Spięcia brzucha (Maszyna)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab8', name: 'Unoszenie kolan do klatki leżąc', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab9', name: 'Ab Wheel (Kółko)', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' },
  { id: 'ab10', name: 'Mountain Climbers', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif' }
];

const Workout = () => {
  // --- STANY CORE ---
  const [activeTab, setActiveTab] = useState<'strength' | 'cardio' | 'atlas' | 'history'>('strength');
  const [routines, setRoutines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");

  // --- STANY SESJI ---
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [showRestOverlay, setShowRestOverlay] = useState(false);

  // --- STANY CARDIO (STRAVA ENGINE) ---
  const [isCardioTracking, setIsCardioTracking] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true); // NOWY STAN DLA LOADERA
  const [cardioTime, setCardioTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coords, setCoords] = useState({ lat: 52.1224, lng: 20.8033 });
  const [lastPos, setLastPos] = useState<{lat: number, lng: number} | null>(null);

  // --- STANY EDYTORÓW ---
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [showMultiPicker, setShowMultiPicker] = useState(false);
  const [selectedInPicker, setSelectedInPicker] = useState<string[]>([]);
  const [viewingExercise, setViewingExercise] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. INICJALIZACJA DANYCH
  useEffect(() => {
    setRoutines(getWorkoutRoutines() || []);
    setHistory(getWorkoutHistory() || []);
    audioRef.current = new Audio();
    audioRef.current.muted = true;
    setIsLoaded(true);
  }, []);

  // Reset loadera mapy przy zmianie tabu
  useEffect(() => {
    if (activeTab === 'cardio') setIsMapLoading(true);
  }, [activeTab]);

  // 2. GPS LIVE & ALGORYTM HAVERSINE (DOKŁADNOŚĆ STRAVA)
  useEffect(() => {
    let watchId: any;
    const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    if (isCardioTracking || activeTab === 'cardio') {
      watchId = navigator.geolocation.watchPosition(
        (p) => {
          const newPos = { lat: p.coords.latitude, lng: p.coords.longitude };
          setCoords(newPos);
          if (isCardioTracking && lastPos) {
            const d = calculateHaversine(lastPos.lat, lastPos.lng, newPos.lat, newPos.lng);
            if (d > 0.002) setDistance(prev => prev + d);
          }
          setLastPos(newPos);
        },
        null, { enableHighAccuracy: true }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isCardioTracking, activeTab, lastPos]);

  // 3. MASTER TIMER ENGINE
  useEffect(() => {
    let interval: any;
    if (activeWorkout || isCardioTracking) {
      interval = setInterval(() => {
        if (activeWorkout) {
          setTimer(t => t + 1);
          if (restTimer > 0) setRestTimer(r => r - 1);
          else setShowRestOverlay(false);
        }
        if (isCardioTracking) setCardioTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWorkout, isCardioTracking, restTimer]);

  // 4. ANALITYKA OBJĘTOŚCI (WYKRES)
  const volumeData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history
      .filter(h => h.type === 'strength')
      .slice(-7)
      .map(h => ({
        date: h.date.split('.')[0] + '/' + h.date.split('.')[1],
        vol: h.vol || 0
      }));
  }, [history]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const calculateVolume = (exercises: any[]) => {
    return exercises.reduce((acc: number, ex: any) => {
      return acc + ex.sets.reduce((sAcc: number, set: any) => {
        return sAcc + (set.completed ? (parseFloat(set.weight) || 0) * (parseFloat(set.reps) || 0) : 0);
      }, 0);
    }, 0);
  };

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-24 space-y-6 bg-black min-h-screen text-zinc-100 font-sans">
        
        {/* --- HEADER --- */}
        {!activeWorkout && !editingRoutine && (
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">ELITE PRO</h1>
            <div className="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
              {[{id:'strength', i:Dumbbell}, {id:'cardio', i:Navigation}, {id:'atlas', i:Video}, {id:'history', i:HistoryIcon}].map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`p-2 px-4 rounded-xl transition-all ${activeTab === t.id ? 'bg-white text-black shadow-lg' : 'text-zinc-600'}`}>
                  <t.i size={20} />
                </button>
              ))}
            </div>
          </header>
        )}

        {/* --- ZAKŁADKA: SIŁA --- */}
        {activeTab === 'strength' && !activeWorkout && !editingRoutine && (
          <div className="space-y-6 animate-in fade-in">
            {/* WYKRES PROGRESU */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] min-h-[220px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Objętość</h3>
                <TrendingUp size={20} className="text-emerald-500" />
              </div>
              <div className="h-32 w-full">
                {volumeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeData}>
                      <defs>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="vol" stroke="#10b981" strokeWidth={3} fill="url(#colorVol)" />
                      <XAxis dataKey="date" hide />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-zinc-800 py-10 text-[10px] font-black uppercase italic">Brak danych sesji</p>}
              </div>
            </div>

            <button onClick={() => setActiveWorkout({ name: 'Szybki Trening', exercises: [] })} className="w-full bg-blue-600 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20">Start Empty Workout</button>

            {/* MOJE RUTYNY */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xs font-black uppercase text-zinc-500">Moje Plany ({routines.length})</h2>
                <button onClick={() => setEditingRoutine({ id: Date.now().toString(), name: 'NOWY PLAN', exercises: [] })} className="p-2"><Plus size={20}/></button>
              </div>
              {routines.map(r => (
                <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] flex justify-between items-center group">
                  <div onClick={() => setActiveWorkout(JSON.parse(JSON.stringify(r)))} className="flex-1 cursor-pointer">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{r.name}</h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{r.exercises.length} ćwiczeń</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingRoutine(r)} className="text-zinc-600"><Edit3 size={18} /></button>
                    <button onClick={() => { if(confirm("Usunąć plan?")) { deleteRoutine(r.id); setRoutines(getWorkoutRoutines()); } }} className="text-zinc-800"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ZAKŁADKA: CARDIO (NAPRAWIONA MAPA + LOADER) --- */}
        {activeTab === 'cardio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="w-full aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-900 relative shadow-inner">
              
              {/* LOADER MAPY */}
              {isMapLoading && (
                <div className="absolute inset-0 z-10 bg-zinc-900 flex items-center justify-center">
                   <div className="w-10 h-10 border-4 border-zinc-800 border-t-blue-500 rounded-full animate-spin" />
                </div>
              )}

              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                style={{ filter: 'grayscale(0.6) contrast(1.2) brightness(0.8)' }}
                onLoad={() => setIsMapLoading(false)}
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=k&z=17&output=embed&layer=s`} 
              />
              <div className="absolute top-6 left-6 bg-black/80 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 z-20">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-white">GPS LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">DYSTANS KM</p>
                <p className="text-5xl font-black italic">{distance.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">CZAS</p>
                <p className="text-5xl font-black italic">{formatTime(cardioTime)}</p>
              </div>
            </div>
            <button onClick={() => { setIsCardioTracking(!isCardioTracking); if(!isCardioTracking) {setDistance(0); setCardioTime(0);} }}
              className={`w-full py-7 rounded-[2.5rem] font-black uppercase text-lg ${isCardioTracking ? 'bg-red-600' : 'bg-white text-black'}`}>
              {isCardioTracking ? 'STOP' : 'START CARDIO'}
            </button>
          </div>
        )}

        {/* --- ZAKŁADKA: ATLAS --- */}
        {activeTab === 'atlas' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="SZUKAJ ĆWICZENIA..." className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl font-black uppercase text-xs text-white outline-none" />
             </div>
             {EXERCISE_DB.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase())).map(ex => (
               <div key={ex.id} onClick={() => setViewingExercise(ex)} className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex items-center gap-4 cursor-pointer hover:border-zinc-700 transition-all">
                 <img src={ex.video} className="w-14 h-14 rounded-xl object-cover opacity-50" />
                 <h4 className="font-black text-xs uppercase italic flex-1">{ex.name}</h4>
                 <ChevronRight size={16} className="text-zinc-800" />
               </div>
             ))}
          </div>
        )}

        {/* --- ZAKŁADKA: HISTORIA --- */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center px-1 mb-2">
               <h2 className="text-xs font-black uppercase text-zinc-500">Historia Treningów</h2>
               <button onClick={() => { if(confirm("Wyczyścić historię?")) { clearHistory(); setHistory([]); } }}><Trash2 size={16} className="text-zinc-800"/></button>
            </div>
            {history.slice().reverse().map(h => (
              <div key={h.id} onClick={() => setSelectedHistoryItem(h)} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center gap-4 cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-emerald-500">
                  {h.type === 'cardio' ? <Navigation size={22} /> : <Dumbbell size={22} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-sm uppercase italic">{h.name}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase">{h.date} • {h.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-500">{h.details}</p>
                  <ChevronRight size={14} className="text-zinc-800 inline" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODALE SESJI, EDYTORÓW I PICKERÓW --- */}
        <AnimatePresence>
          {activeWorkout && !showSaveModal && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[200] bg-black overflow-y-auto pb-40">
              {/* HEADER TRENINGU */}
              <div className="sticky top-0 bg-black/90 backdrop-blur-xl p-6 border-b border-zinc-900 flex justify-between items-center z-[210]">
                <button onClick={() => setActiveWorkout(null)}><X size={24} className="text-zinc-600" /></button>
                <div className="text-center"><h2 className="font-black uppercase italic text-sm">{activeWorkout.name}</h2><p className="text-[10px] font-bold text-blue-500">{formatTime(timer)}</p></div>
                <button onClick={() => setShowSaveModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black uppercase text-[10px]">Finish</button>
              </div>

              {/* LISTA ĆWICZEŃ W SESJI */}
              <div className="p-4 space-y-6">
                {activeWorkout.exercises.map((ex: any, exIdx: number) => (
                  <div key={exIdx} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 space-y-4">
                    <h4 className="font-black uppercase italic text-sm text-blue-500">{ex.name}</h4>
                    <div className="grid grid-cols-5 text-[8px] font-black text-zinc-700 uppercase px-2 text-center"><span>Seria</span><span>Poprz.</span><span>Kg</span><span>Powt.</span><span>✓</span></div>
                    {ex.sets.map((set: any, sIdx: number) => (
                      <div key={sIdx} className={`grid grid-cols-5 items-center p-3 rounded-2xl ${set.completed ? 'bg-emerald-900/20' : 'bg-black/20'}`}>
                        <span className="text-[10px] font-black text-zinc-800 text-center">{sIdx+1}</span>
                        <span className="text-[9px] text-zinc-700 italic text-center">—</span>
                        <input type="number" className="bg-black w-10 text-center rounded-lg p-2 font-black text-xs outline-none" value={set.weight} onChange={(e)=>{const cp={...activeWorkout}; cp.exercises[exIdx].sets[sIdx].weight=e.target.value; setActiveWorkout(cp);}} />
                        <input type="number" className="bg-black w-10 text-center rounded-lg p-2 font-black text-xs outline-none" value={set.reps} onChange={(e)=>{const cp={...activeWorkout}; cp.exercises[exIdx].sets[sIdx].reps=e.target.value; setActiveWorkout(cp);}} />
                        <button onClick={() => {
                          const cp = {...activeWorkout};
                          cp.exercises[exIdx].sets[sIdx].completed = !cp.exercises[exIdx].sets[sIdx].completed;
                          if(cp.exercises[exIdx].sets[sIdx].completed) { setRestTimer(90); setShowRestOverlay(true); }
                          setActiveWorkout(cp);
                        }} className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-600'}`}><Check size={18} strokeWidth={4} /></button>
                      </div>
                    ))}
                    <button onClick={()=>{const cp={...activeWorkout}; cp.exercises[exIdx].sets.push({weight:'', reps:'', completed:false}); setActiveWorkout(cp);}} className="w-full bg-zinc-800/30 py-2 rounded-xl text-[10px] font-black uppercase text-zinc-700">+ Dodaj Serię</button>
                  </div>
                ))}
                <button onClick={() => setShowMultiPicker(true)} className="w-full bg-blue-600/10 text-blue-500 py-4 rounded-2xl font-black uppercase text-xs border border-blue-500/20">+ Dodaj Ćwiczenie</button>
              </div>

              {/* REST TIMER OVERLAY */}
              <AnimatePresence>
                {showRestOverlay && (
                  <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-8 rounded-t-[3rem] z-[250] text-center border-t border-zinc-800 shadow-2xl">
                    <p className="text-7xl font-black italic tracking-tighter tabular-nums mb-6">{formatTime(restTimer)}</p>
                    <div className="flex gap-3"><button onClick={()=>setRestTimer(p=>p+15)} className="flex-1 bg-zinc-800 py-4 rounded-2xl font-black">+15s</button><button onClick={()=>setShowRestOverlay(false)} className="flex-1 bg-blue-600 py-4 rounded-2xl font-black">Skip</button></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDYTOR RUTYNY */}
        <AnimatePresence>
          {editingRoutine && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[350] bg-black p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-10 text-white">
                <input className="bg-transparent text-3xl font-black uppercase italic outline-none border-b border-zinc-800 w-2/3" value={editingRoutine.name} onChange={(e)=>setEditingRoutine({...editingRoutine, name: e.target.value.toUpperCase()})} />
                <button onClick={() => setEditingRoutine(null)}><X size={30}/></button>
              </div>
              <div className="space-y-4 mb-32">
                {editingRoutine.exercises.map((ex: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center">
                    <h4 className="font-black uppercase italic text-xs">{ex.name}</h4>
                    <button onClick={() => setEditingRoutine({...editingRoutine, exercises: editingRoutine.exercises.filter((_:any,i:number)=>i!==idx)})}><Trash2 size={18} className="text-zinc-700"/></button>
                  </div>
                ))}
                <button onClick={() => setShowMultiPicker(true)} className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-black uppercase text-[10px]">+ Dodaj Ćwiczenia</button>
              </div>
              <div className="fixed bottom-10 left-6 right-6">
                <button onClick={() => { saveRoutine(editingRoutine); setRoutines(getWorkoutRoutines()); setEditingRoutine(null); }} className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-2xl">Zapisz Plan</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MULTI PICKER ĆWICZEŃ */}
        <AnimatePresence>
          {showMultiPicker && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-black/95 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-10"><h3 className="text-2xl font-black uppercase italic">Wybierz</h3><button onClick={()=>setShowMultiPicker(false)}><X /></button></div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
                {EXERCISE_DB.map(ex => (
                  <div key={ex.id} onClick={() => setSelectedInPicker(prev => prev.includes(ex.id) ? prev.filter(i => i !== ex.id) : [...prev, ex.id])} className={`p-5 rounded-[2rem] border transition-all ${selectedInPicker.includes(ex.id) ? 'bg-zinc-800 border-white' : 'bg-zinc-900 border-zinc-800'}`}>
                    <div className="flex justify-between items-center"><p className="font-black uppercase text-xs italic">{ex.name}</p><div className={`w-6 h-6 rounded-lg border-2 ${selectedInPicker.includes(ex.id) ? 'bg-white border-white' : 'border-zinc-800'}`}>{selectedInPicker.includes(ex.id) && <Check size={16} className="text-black" />}</div></div>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const newExs = selectedInPicker.map(id => {
                  const db = EXERCISE_DB.find(ex => ex.id === id);
                  return { id: Math.random().toString(36).substr(2, 9), name: db!.name, sets: [{ weight: '', reps: '', completed: false }] };
                });
                if(editingRoutine) setEditingRoutine({...editingRoutine, exercises: [...editingRoutine.exercises, ...newExs]});
                if(activeWorkout) setActiveWorkout({...activeWorkout, exercises: [...activeWorkout.exercises, ...newExs]});
                setSelectedInPicker([]); setShowMultiPicker(false);
              }} className="mt-6 w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black uppercase shadow-xl">Dodaj ({selectedInPicker.length})</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL ZAPISU SESJI */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[450] bg-black p-6 overflow-y-auto">
              <header className="flex justify-between items-center mb-10"><button onClick={() => setShowSaveModal(false)}><ChevronRight className="rotate-180" /></button><h2 className="font-black uppercase italic">Zapisz</h2><button onClick={() => {
                const vol = calculateVolume(activeWorkout.exercises);
                addToHistory({ 
                  id: Date.now().toString(), type: 'strength', name: activeWorkout.name, date: new Date().toLocaleDateString(), 
                  duration: formatTime(timer), details: `${vol} kg`, vol: vol, 
                  kcal: Math.round(vol * 0.05) + 100, exercises_data: activeWorkout.exercises 
                });
                setActiveWorkout(null); setShowSaveModal(false); setHistory(getWorkoutHistory()); setActiveTab('history');
              }} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase text-xs">Zapisz Sesję</button></header>
              <div className="space-y-8">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter">{activeWorkout.name}</h1>
                <div className="grid grid-cols-3 gap-6 border-y border-zinc-900 py-8 text-center font-black">
                  <div><p className="text-[8px] text-zinc-600 uppercase mb-1">Czas</p><p className="text-xl text-blue-500">{formatTime(timer)}</p></div>
                  <div><p className="text-[8px] text-zinc-600 uppercase mb-1">Objętość</p><p className="text-xl">{calculateVolume(activeWorkout.exercises)} kg</p></div>
                  <div><p className="text-[8px] text-zinc-600 uppercase mb-1">Serie</p><p className="text-xl">{activeWorkout.exercises.reduce((a:any, e:any)=>a+e.sets.length,0)}</p></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL SZCZEGÓŁÓW HISTORII */}
        <AnimatePresence>
          {selectedHistoryItem && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[500] bg-black p-6 overflow-y-auto">
              <header className="flex justify-between items-center mb-10"><button onClick={() => setSelectedHistoryItem(null)}><ChevronRight className="rotate-180" /></button><h2 className="font-black uppercase italic text-sm">Podsumowanie</h2><button onClick={() => { if(confirm("Usunąć?")) { deleteHistoryItem(selectedHistoryItem.id); setHistory(getWorkoutHistory()); setSelectedHistoryItem(null); } }}><Trash2 size={20}/></button></header>
              <div className="space-y-8">
                <h1 className="text-4xl font-black italic uppercase leading-none">{selectedHistoryItem.name}</h1>
                <p className="text-blue-500 font-black text-xs uppercase">{selectedHistoryItem.date} • {selectedHistoryItem.duration}</p>
                <div className="grid grid-cols-2 gap-4 border-y border-zinc-900 py-6">
                   <div><p className="text-[8px] font-black text-zinc-600 uppercase">Objętość</p><p className="text-2xl font-black">{selectedHistoryItem.vol || 0} kg</p></div>
                   <div><p className="text-[8px] font-black text-zinc-600 uppercase">Spalone</p><p className="text-2xl font-black text-orange-500">~{selectedHistoryItem.kcal} kcal</p></div>
                </div>
                <div className="space-y-6">
                  {selectedHistoryItem.exercises_data?.map((ex: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <h4 className="text-blue-400 font-black uppercase text-sm italic">{ex.name}</h4>
                      {ex.sets.map((s: any, si: number) => (
                        <div key={si} className="bg-zinc-900/40 p-3 rounded-xl flex justify-between px-6 text-sm font-black italic">
                          <span className="text-zinc-700">Set {si+1}</span>
                          <span>{s.weight}kg × {s.reps}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default Workout;