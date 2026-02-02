import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, Zap, History as HistoryIcon, Plus, Play, X, Check,
  ChevronRight, ChevronLeft, Video, Search, Trash2, Edit3, Save, Timer, 
  MapPin, Activity, Coffee, BrainCircuit, Navigation, Pause, 
  FolderPlus, TrendingUp, MoreHorizontal, Award, Calendar, Info, Lightbulb
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { 
  getWorkoutRoutines, getWorkoutHistory, addToHistory, 
  deleteHistoryItem, clearHistory, saveRoutine, deleteRoutine
} from '@/lib/user-store';

// --- GIGANTYCZNA BAZA 30 ĆWICZEŃ Z PROTIPAMI (Atlas) ---
const EXERCISE_DB = [
  // KLATKA (Chest)
  { id: 'ch1', name: 'Wyciskanie Sztangi (Płaska)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Wbij łopatki w ławkę i zachowaj lekką restrykcję w lędźwiach (mostek). Prowadź łokcie pod kątem 45 stopni względem tułowia.' },
  { id: 'ch2', name: 'Wyciskanie Hantli (Skos)', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Skup się na kontrolowanym rozciągnięciu klatki w dolnej fazie. Nie blokuj łokci w pełnym wyproście.' },
  { id: 'ch3', name: 'Rozpiętki z Hantlami', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Utrzymuj stałe ugięcie w łokciach. Wyobraź sobie, że obejmujesz wielkie drzewo.' },
  { id: 'ch4', name: 'Dipy klatkowe', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Pochyl tułów do przodu i trzymaj łokcie szeroko, aby przenieść ciężar z tricepsów na klatkę.' },
  { id: 'ch5', name: 'Pec Deck', muscle: 'Klatka piersiowa', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Zatrzymaj ruch na 1 sekundę w maksymalnym spięciu klatki. Nie pozwól barkom wysuwać się do przodu.' },
  // PLECY (Back)
  { id: 'bk1', name: 'Podciąganie na Drążku', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif', tip: 'Inicjuj ruch od ściągnięcia łopatek w dół. Ciągnij klatkę do drążka, a nie tylko brodę.' },
  { id: 'bk2', name: 'Wiosłowanie Sztangą', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif', tip: 'Trzymaj plecy proste, niemal równolegle do ziemi. Ciągnij sztangę do bioder, a nie do klatki.' },
  { id: 'bk3', name: 'Wiosłowanie Hantlem', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif', tip: 'Skup się na wyciągnięciu łopatki w dół i maksymalnym skurczu najszerszego grzbietu w górze.' },
  { id: 'bk4', name: 'Ściąganie drążka górnego', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif', tip: 'Nie odchylaj się nadmiernie do tyłu. Prowadź drążek do górnej części klatki.' },
  { id: 'bk5', name: 'Martwy Ciąg', muscle: 'Plecy', video: 'https://media.giphy.com/media/v96v9v6v9v6v/giphy.gif', tip: 'Trzymaj sztangę jak najbliżej piszczeli. Napnij brzuch (tłocznia brzuszna) przed każdym uniesieniem.' },
  // NOGI (Legs)
  { id: 'lg1', name: 'Przysiady ze Sztangą', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Ciężar rozłożony na całej stopie. Kolana prowadź w linii palców u stóp, unikaj ich schodzenia się do środka.' },
  { id: 'lg2', name: 'Wypychanie na suwnicy', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Nie prostuj nóg do blokady w kolanach. Trzymaj biodra dociśnięte do oparcia.' },
  { id: 'lg3', name: 'Martwy ciąg rumuński', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Wypychaj biodra jak najdalej do tyłu. Poczuj rozciąganie na dwugłowych ud.' },
  { id: 'lg4', name: 'Wykroki chodzone', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Trzymaj tułów pionowo. Nie pozwól, aby przednie kolano wyprzedzało linię palców.' },
  { id: 'lg5', name: 'Prostowanie nóg', muscle: 'Nogi', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Zatrzymaj ruch na sekundę w pełnym wyproście, aby maksymalnie dopiąć czworogłowe.' },
  // BARKI (Shoulders)
  { id: 'sh1', name: 'Wyciskanie Żołnierskie', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Napnij pośladki i brzuch, aby uniknąć przeprostu w lędźwiach. Sztangę prowadź blisko twarzy.' },
  { id: 'sh2', name: 'Wznosy bokiem', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Inicjuj ruch od łokcia. Wyobraź sobie, że wylewasz wodę z dzbanków trzymanych w dłoniach.' },
  { id: 'sh3', name: 'Facepulls', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Ciągnij linkę do czoła, rozchylając dłonie na boki. Skup się na tylnym aktonie barku.' },
  { id: 'sh4', name: 'Arnoldki', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Rotacja nadgarstka powinna być płynna. Nie odchylaj się do tyłu przy wyciskaniu.' },
  { id: 'sh5', name: 'Podciąganie sztangi', muscle: 'Barki', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Prowadź łokcie wysoko nad dłońmi. Nie szarp ciężarem, wykonuj ruch kontrolowany.' },
  // RAMIONA (Arms)
  { id: 'arm1', name: 'Uginanie ze Sztangą', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Łokcie trzymaj nieruchomo przy żebrach. Nie bujaj tułowiem.' },
  { id: 'arm2', name: 'Uginanie młotkowe', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Mocny chwyt angażuje mięsień ramienno-promieniowy. Nie prostuj rąk do pełnego zwisu.' },
  { id: 'arm3', name: 'Modlitewnik', muscle: 'Biceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Skup się na dolnej fazie ruchu, ale nie przeprostowuj łokci pod obciążeniem.' },
  { id: 'arm4', name: 'Wyciskanie francuskie', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Prowadź sztangę do czoła lub lekko za głowę. Łokcie trzymaj jak najbliżej siebie.' },
  { id: 'arm5', name: 'Prostowanie linek', muscle: 'Triceps', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Zablokuj ramię od barku do łokcia. Ruch wykonuj tylko przedramionami.' },
  // BRZUCH (Core)
  { id: 'ab1', name: 'Unoszenie nóg w zwisie', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Podwijaj miednicę pod siebie. To nie nogi mają iść do góry, a biodra mają się "zwijać".' },
  { id: 'ab2', name: 'Allahy', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Zablokuj biodra w jednej pozycji. Pracuj wyłącznie mięśniami brzucha zwijając kręgosłup.' },
  { id: 'ab3', name: 'Plank', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Linia prosta od głowy do pięt. Napnij pośladki i wciągnij pępek do kręgosłupa.' },
  { id: 'ab4', name: 'Spięcia brzucha', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Nie ciągnij głowy dłońmi. Skup się na zbliżeniu żeber do kolców biodrowych.' },
  { id: 'ab5', name: 'Rowerek', muscle: 'Brzuch', video: 'https://media.giphy.com/media/3o7TKMGpxx66C3GZpu/giphy.gif', tip: 'Wykonuj pełne rotacje tułowia. Przeciwny łokieć do przeciwnego kolana.' }
];

const Workout = () => {
  // --- STANY CORE ---
  const [activeTab, setActiveTab] = useState<'strength' | 'cardio' | 'atlas' | 'history'>('strength');
  const [routines, setRoutines] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");

  // --- STANY SESJI TRENINGOWEJ ---
  const [activeWorkout, setActiveWorkout] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [showRestOverlay, setShowRestOverlay] = useState(false);

  // --- STANY CARDIO ---
  const [isCardioTracking, setIsCardioTracking] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [cardioTime, setCardioTime] = useState(0);
  const [distance, setDistance] = useState(0);
  const [coords, setCoords] = useState({ lat: 52.2297, lng: 21.0122 });
  const [lastPos, setLastPos] = useState<{lat: number, lng: number} | null>(null);

  // --- STANY EDYTORÓW ---
  const [editingRoutine, setEditingRoutine] = useState<any>(null);
  const [showMultiPicker, setShowMultiPicker] = useState(false);
  const [selectedInPicker, setSelectedInPicker] = useState<string[]>([]);
  const [viewingExercise, setViewingExercise] = useState<any>(null);

  // Inicjalizacja danych
  useEffect(() => {
    setRoutines(getWorkoutRoutines());
    setHistory(getWorkoutHistory());
    setIsLoaded(true);
  }, []);

  // --- BLOKADA SCROLLOWANIA TŁA ---
  useEffect(() => {
    const isAnyModalOpen = activeWorkout || editingRoutine || showMultiPicker || viewingExercise || selectedHistoryItem;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeWorkout, editingRoutine, showMultiPicker, viewingExercise, selectedHistoryItem]);

  // Timer Silnik
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

  // GPS & Dystans (Haversine)
  useEffect(() => {
    let watchId: any;
    if (activeTab === 'cardio' || isCardioTracking) {
      watchId = navigator.geolocation.watchPosition((p) => {
        const newPos = { lat: p.coords.latitude, lng: p.coords.longitude };
        setCoords(newPos);
        if (isCardioTracking && lastPos) {
          const R = 6371;
          const dLat = (newPos.lat - lastPos.lat) * Math.PI / 180;
          const dLon = (newPos.lng - lastPos.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lastPos.lat * Math.PI / 180) * Math.cos(newPos.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
          const d = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
          if (d > 0.001) setDistance(prev => prev + d);
        }
        setLastPos(newPos);
      }, null, { enableHighAccuracy: true });
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isCardioTracking, activeTab, lastPos]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const calculateVolume = (exercises: any[]) => {
    return exercises.reduce((acc, ex) => acc + ex.sets.reduce((sAcc: number, set: any) => 
      sAcc + (set.completed ? (parseFloat(set.weight) || 0) * (parseFloat(set.reps) || 0) : 0), 0), 0);
  };

  // --- ELITE PRO AI ADVISOR LOGIC ---
  const generateEliteTip = (item: any) => {
    const volume = item.vol || 0;
    const name = item.name.toLowerCase();
    
    if (volume > 5000) return "Potężna objętość! Twój układ nerwowy może być obciążony. Na następnym treningu skup się na tempie 3-0-1-0, aby zwiększyć stres metaboliczny bez dokładania ciężaru.";
    if (name.includes("klat") || name.includes("chest")) return "Dobra sesja klatki. Następnym razem dodaj pauzę 2-sekundową w pełnym rozciągnięciu w pierwszej serii wyciskania, aby zwerbować więcej jednostek motorycznych.";
    if (name.includes("plecy") || name.includes("back")) return "Plecy lubią dużą różnorodność kątów. W kolejnym bloku zamień wiosłowanie sztangą na hantle, aby zwiększyć zakres ruchu i poprawić symetrię.";
    if (name.includes("nogi") || name.includes("leg")) return "Nogi wymagają precyzji. Jeśli dzisiaj czułeś lędźwia przy przysiadach, spróbuj ustawić pięty na 2-centymetrowym podwyższeniu następnym razem.";
    
    return "Solidny progres. Pamiętaj o zasadzie +1: na następnym treningu dołóż 1kg lub wykonaj 1 powtórzenie więcej w kluczowych bojach.";
  };

  if (!isLoaded) return <div className="min-h-screen bg-black" />;

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-24 space-y-6 bg-black min-h-screen text-zinc-100">
        
        {/* HEADER */}
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

        {/* SIŁA / STRENGTH */}
        {activeTab === 'strength' && !activeWorkout && !editingRoutine && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setActiveWorkout({ name: 'Szybki Trening', exercises: [] })}
              className="w-full bg-blue-600 py-6 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-600/20"
            >
              Start Empty Workout
            </button>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Moje Plany</h2>
                <button onClick={() => setEditingRoutine({ id: Date.now().toString(), name: 'NOWY PLAN', exercises: [] })} className="p-2"><Plus size={20}/></button>
              </div>
              {routines.map(r => (
                <div key={r.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] flex justify-between items-center">
                  <div onClick={() => setActiveWorkout(JSON.parse(JSON.stringify(r)))} className="flex-1 cursor-pointer">
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter">{r.name}</h3>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase">{r.exercises.length} ćwiczeń</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingRoutine(r)} className="text-zinc-600"><Edit3 size={18} /></button>
                    <button onClick={() => { if(confirm("Usunąć?")) { deleteRoutine(r.id); setRoutines(getWorkoutRoutines()); } }} className="text-zinc-800"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CARDIO */}
        {activeTab === 'cardio' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="w-full aspect-square rounded-[3rem] overflow-hidden border border-zinc-800 bg-zinc-900 relative">
              {isMapLoading && <div className="absolute inset-0 z-10 bg-zinc-900 flex items-center justify-center animate-pulse" />}
              <iframe 
                width="100%" height="100%" frameBorder="0" 
                style={{ filter: 'grayscale(0.6) contrast(1.2) brightness(0.8)' }}
                onLoad={() => setIsMapLoading(false)}
                src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=k&z=17&output=embed`} 
              />
              <div className="absolute top-6 left-6 bg-black/80 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase">GPS LIVE</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">DYSTANS KM</p>
                <p className="text-5xl font-black italic tracking-tighter">{distance.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-800 text-center">
                <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">CZAS</p>
                <p className="text-5xl font-black italic tracking-tighter">{formatTime(cardioTime)}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                if(!isCardioTracking) { setDistance(0); setCardioTime(0); }
                setIsCardioTracking(!isCardioTracking);
              }}
              className={`w-full py-7 rounded-[2.5rem] font-black uppercase text-lg ${isCardioTracking ? 'bg-red-600' : 'bg-white text-black'}`}
            >
              {isCardioTracking ? 'STOP' : 'START CARDIO'}
            </button>
          </div>
        )}

        {/* ATLAS */}
        {activeTab === 'atlas' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                <input 
                  value={search} onChange={(e)=>setSearch(e.target.value)} 
                  placeholder="SZUKAJ ĆWICZENIA..." 
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 rounded-2xl font-black uppercase text-xs text-white outline-none" 
                />
             </div>
             {EXERCISE_DB.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase())).map(ex => (
               <div key={ex.id} onClick={() => setViewingExercise(ex)} className="bg-zinc-900 p-4 rounded-3xl border border-zinc-800 flex items-center gap-4 cursor-pointer">
                 <img src={ex.video} className="w-14 h-14 rounded-xl object-cover opacity-50" />
                 <div className="flex-1">
                    <h4 className="font-black text-xs uppercase italic tracking-tight">{ex.name}</h4>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase">{ex.muscle}</p>
                 </div>
                 <ChevronRight size={16} className="text-zinc-800" />
               </div>
             ))}
          </div>
        )}

        {/* MODAL: SZCZEGÓŁY ĆWICZENIA (Atlas) */}
        <AnimatePresence>
          {viewingExercise && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[500] bg-black p-6 overflow-y-auto h-screen">
              <header className="flex justify-between items-center mb-10">
                <button onClick={() => setViewingExercise(null)}><ChevronLeft size={30} /></button>
                <h2 className="font-black uppercase italic tracking-tighter">Elite Atlas</h2>
                <div className="w-8" />
              </header>
              <div className="space-y-8">
                <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-zinc-800">
                  <img src={viewingExercise.video} className="w-full h-full object-cover" alt={viewingExercise.name} />
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-black italic uppercase leading-none tracking-tighter">{viewingExercise.name}</h1>
                  <span className="inline-block bg-blue-600/10 text-blue-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">{viewingExercise.muscle}</span>
                  
                  <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 space-y-4">
                    <div className="flex items-center gap-2 text-blue-500">
                      <Zap size={18} />
                      <h4 className="font-black uppercase italic text-xs tracking-widest">Elite Protip</h4>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium italic leading-relaxed">{viewingExercise.tip}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HISTORIA */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center px-1">
               <h2 className="text-xs font-black uppercase text-zinc-500 tracking-widest">Ostatnie sesje</h2>
               <button onClick={() => { if(confirm("Wyczyścić?")) { clearHistory(); setHistory([]); } }} className="text-zinc-800"><Trash2 size={16}/></button>
            </div>
            {history.slice().reverse().map(h => (
              <div key={h.id} onClick={() => setSelectedHistoryItem(h)} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center gap-4 cursor-pointer group">
                <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-emerald-500">
                  {h.type === 'cardio' ? <Navigation size={22} /> : <Dumbbell size={22} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-sm uppercase italic tracking-tight">{h.name}</h4>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{h.date} • {h.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-emerald-500">{h.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL: SZCZEGÓŁY HISTORII (WGLĄD W TRENING) */}
        <AnimatePresence>
          {selectedHistoryItem && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[600] bg-black p-6 overflow-y-auto h-screen">
              <header className="flex justify-between items-center mb-10">
                <button onClick={() => setSelectedHistoryItem(null)}><ChevronLeft size={30} /></button>
                <h2 className="font-black uppercase italic tracking-tighter text-xs">Raport Sesji</h2>
                <button onClick={() => { if(confirm("Usunąć ten rekord?")) { deleteHistoryItem(selectedHistoryItem.id); setHistory(getWorkoutHistory()); setSelectedHistoryItem(null); } }} className="text-red-500"><Trash2 size={20}/></button>
              </header>

              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-black italic uppercase leading-none tracking-tighter text-blue-500 mb-2">{selectedHistoryItem.name}</h1>
                  <p className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em]">{selectedHistoryItem.date} • {selectedHistoryItem.duration}</p>
                </div>

                {/* AI ADVISOR CARD */}
                <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center gap-3 text-blue-400">
                    <BrainCircuit size={24} />
                    <h4 className="font-black uppercase italic text-xs">Elite AI Advisor</h4>
                  </div>
                  <p className="text-zinc-300 text-sm italic font-medium leading-relaxed">
                    {generateEliteTip(selectedHistoryItem)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Całkowity Ciężar</p>
                    <p className="text-2xl font-black italic tabular-nums">{selectedHistoryItem.vol || 0}kg</p>
                  </div>
                  <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-zinc-800">
                    <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Spalone Kalorie</p>
                    <p className="text-2xl font-black italic tabular-nums text-orange-500">~{selectedHistoryItem.kcal || 0}kcal</p>
                  </div>
                </div>

                {/* EXERCISE BREAKDOWN */}
                <div className="space-y-6 pb-20">
                  <h3 className="font-black uppercase italic text-xs tracking-widest text-zinc-500 px-1">Rozkład Ćwiczeń</h3>
                  {selectedHistoryItem.exercises_data?.map((ex: any, i: number) => (
                    <div key={i} className="bg-zinc-900/30 rounded-[2.5rem] border border-zinc-800/50 overflow-hidden">
                      <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
                        <span className="font-black uppercase italic text-sm text-blue-400 tracking-tight">{ex.name}</span>
                        <span className="text-[10px] font-black text-zinc-600 uppercase">{ex.sets.length} SERIE</span>
                      </div>
                      <div className="p-5 space-y-3">
                        {ex.sets.map((s: any, si: number) => (
                          <div key={si} className="flex justify-between items-center text-xs font-bold px-2">
                            <span className="text-zinc-700 uppercase italic">Seria {si+1}</span>
                            <div className="flex gap-4">
                              <span>{s.weight} <span className="text-[10px] text-zinc-600">KG</span></span>
                              <span className="text-blue-500">{s.reps} <span className="text-[10px] text-zinc-400 font-black">POWT</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: AKTYWNA SESJA */}
        <AnimatePresence>
          {activeWorkout && !showSaveModal && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-0 z-[200] bg-black overflow-y-auto pb-40 h-screen">
              <div className="sticky top-0 bg-black/90 backdrop-blur-xl p-6 border-b border-zinc-900 flex justify-between items-center z-[210]">
                <button onClick={() => setActiveWorkout(null)}><X size={24} className="text-zinc-600" /></button>
                <div className="text-center">
                  <h2 className="font-black uppercase italic text-sm">{activeWorkout.name}</h2>
                  <p className="text-[10px] font-bold text-blue-500 tabular-nums">{formatTime(timer)}</p>
                </div>
                <button onClick={() => setShowSaveModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl font-black uppercase text-[10px]">Finish</button>
              </div>

              <div className="p-4 space-y-6">
                {activeWorkout.exercises.map((ex: any, exIdx: number) => (
                  <div key={exIdx} className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800 space-y-4">
                    <h4 className="font-black uppercase italic text-sm text-blue-500">{ex.name}</h4>
                    <div className="grid grid-cols-5 text-[8px] font-black text-zinc-700 uppercase px-2 text-center">
                      <span>Seria</span><span>Poprz.</span><span>Kg</span><span>Powt.</span><span>✓</span>
                    </div>
                    {ex.sets.map((set: any, sIdx: number) => (
                      <div key={sIdx} className={`grid grid-cols-5 items-center p-3 rounded-2xl ${set.completed ? 'bg-emerald-900/20' : 'bg-black/20'}`}>
                        <span className="text-[10px] font-black text-zinc-800 text-center">{sIdx+1}</span>
                        <span className="text-[9px] text-zinc-700 italic text-center">—</span>
                        <input 
                          type="number" className="bg-black w-10 text-center rounded-lg p-2 font-black text-xs outline-none" 
                          value={set.weight} onChange={(e)=>{
                            const cp={...activeWorkout}; 
                            cp.exercises[exIdx].sets[sIdx].weight=e.target.value; 
                            setActiveWorkout(cp);
                          }} 
                        />
                        <input 
                          type="number" className="bg-black w-10 text-center rounded-lg p-2 font-black text-xs outline-none" 
                          value={set.reps} onChange={(e)=>{
                            const cp={...activeWorkout}; 
                            cp.exercises[exIdx].sets[sIdx].reps=e.target.value; 
                            setActiveWorkout(cp);
                          }} 
                        />
                        <button 
                          onClick={() => {
                            const cp = {...activeWorkout};
                            cp.exercises[exIdx].sets[sIdx].completed = !cp.exercises[exIdx].sets[sIdx].completed;
                            if(cp.exercises[exIdx].sets[sIdx].completed) { setRestTimer(90); setShowRestOverlay(true); }
                            setActiveWorkout(cp);
                          }} 
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${set.completed ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-600'}`}
                        >
                          <Check size={18} strokeWidth={4} />
                        </button>
                      </div>
                    ))}
                    <button onClick={()=>{
                      const cp={...activeWorkout}; 
                      cp.exercises[exIdx].sets.push({weight:'', reps:'', completed:false}); 
                      setActiveWorkout(cp);
                    }} className="w-full bg-zinc-800/30 py-2 rounded-xl text-[10px] font-black uppercase text-zinc-700">+ Dodaj Serię</button>
                  </div>
                ))}
                <button onClick={() => setShowMultiPicker(true)} className="w-full bg-blue-600/10 text-blue-500 py-4 rounded-2xl font-black uppercase text-xs border border-blue-500/20 tracking-widest">+ Dodaj Ćwiczenie</button>
              </div>

              {/* REST OVERLAY */}
              <AnimatePresence>
                {showRestOverlay && (
                  <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-8 rounded-t-[3rem] z-[250] text-center border-t border-zinc-800 shadow-2xl">
                    <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest mb-2">Czas na odpoczynek</p>
                    <p className="text-7xl font-black italic tracking-tighter tabular-nums mb-6">{formatTime(restTimer)}</p>
                    <div className="flex gap-3">
                      <button onClick={()=>setRestTimer(p=>p+15)} className="flex-1 bg-zinc-800 py-4 rounded-2xl font-black text-xs">+15s</button>
                      <button onClick={()=>setShowRestOverlay(false)} className="flex-1 bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Skip</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: EDYTOR PLANU */}
        <AnimatePresence>
          {editingRoutine && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[350] bg-black p-6 overflow-y-auto h-screen">
              <header className="flex justify-between items-center mb-10 text-white">
                <input 
                  className="bg-transparent text-3xl font-black uppercase italic outline-none border-b border-zinc-800 w-2/3" 
                  value={editingRoutine.name} 
                  onChange={(e)=>setEditingRoutine({...editingRoutine, name: e.target.value.toUpperCase()})} 
                />
                <button onClick={() => setEditingRoutine(null)}><X size={30}/></button>
              </header>
              <div className="space-y-4 mb-32">
                {editingRoutine.exercises.map((ex: any, idx: number) => (
                  <div key={idx} className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 flex justify-between items-center">
                    <h4 className="font-black uppercase italic text-xs">{ex.name}</h4>
                    <button onClick={() => setEditingRoutine({...editingRoutine, exercises: editingRoutine.exercises.filter((_:any,i:number)=>i!==idx)})}><Trash2 size={18} className="text-zinc-700"/></button>
                  </div>
                ))}
                <button onClick={() => setShowMultiPicker(true)} className="w-full py-6 border-2 border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-black uppercase text-[10px] tracking-widest">+ Dodaj Ćwiczenia</button>
              </div>
              <div className="fixed bottom-10 left-6 right-6">
                <button 
                  onClick={() => { 
                    saveRoutine(editingRoutine); 
                    setRoutines(getWorkoutRoutines()); 
                    setEditingRoutine(null); 
                  }} 
                  className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase shadow-2xl tracking-widest"
                >
                  Zapisz Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: MULTI PICKER */}
        <AnimatePresence>
          {showMultiPicker && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[400] bg-black/95 p-6 flex flex-col h-screen">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">Wybierz Ćwiczenia</h3>
                <button onClick={()=>setShowMultiPicker(false)}><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {EXERCISE_DB.map(ex => (
                  <div 
                    key={ex.id} 
                    onClick={() => setSelectedInPicker(prev => prev.includes(ex.id) ? prev.filter(i => i !== ex.id) : [...prev, ex.id])} 
                    className={`p-5 rounded-[2rem] border transition-all ${selectedInPicker.includes(ex.id) ? 'bg-zinc-800 border-white' : 'bg-zinc-900 border-zinc-800'}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-black uppercase text-xs italic tracking-tight">{ex.name}</p>
                      <div className={`w-6 h-6 rounded-lg border-2 ${selectedInPicker.includes(ex.id) ? 'bg-white border-white' : 'border-zinc-800'}`}>
                        {selectedInPicker.includes(ex.id) && <Check size={16} className="text-black" />}
                      </div>
                    </div>
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
              }} className="mt-6 w-full bg-blue-600 text-white py-6 rounded-[2.5rem] font-black uppercase italic tracking-widest shadow-xl">Dodaj ({selectedInPicker.length})</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: ZAPISZ SESJĘ */}
        <AnimatePresence>
          {showSaveModal && (
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-0 z-[450] bg-black p-6 flex flex-col overflow-y-auto h-screen">
              <header className="flex justify-between items-center mb-10">
                <button onClick={() => setShowSaveModal(false)}><ChevronLeft size={30} /></button>
                <h2 className="font-black uppercase italic tracking-tighter">Zakończ Sesję</h2>
                <div className="w-8" />
              </header>
              <div className="flex-1 space-y-8">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-blue-500 leading-none">{activeWorkout.name}</h1>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800">
                     <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Czas</p>
                     <p className="text-3xl font-black italic tabular-nums">{formatTime(timer)}</p>
                   </div>
                   <div className="bg-zinc-900 p-6 rounded-[2.5rem] border border-zinc-800">
                     <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Objętość</p>
                     <p className="text-3xl font-black italic tabular-nums">{calculateVolume(activeWorkout.exercises)}kg</p>
                   </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-black uppercase italic text-xs text-zinc-500 tracking-widest">Podsumowanie Ćwiczeń</h3>
                  {activeWorkout.exercises.map((ex: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                      <span className="text-xs font-black uppercase italic tracking-tight">{ex.name}</span>
                      <span className="text-xs font-bold text-zinc-500">{ex.sets.filter((s: any) => s.completed).length} Serie</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => {
                  const vol = calculateVolume(activeWorkout.exercises);
                  addToHistory({ 
                    id: Date.now().toString(), type: 'strength', name: activeWorkout.name, 
                    date: new Date().toLocaleDateString(), duration: formatTime(timer), details: `${vol}kg`,
                    vol: vol, kcal: Math.round(vol * 0.05) + 100, exercises_data: activeWorkout.exercises 
                  });
                  setActiveWorkout(null); setShowSaveModal(false); setHistory(getWorkoutHistory()); setActiveTab('history');
                }}
                className="w-full bg-blue-600 py-6 mt-8 rounded-[2.5rem] font-black uppercase italic text-xl shadow-xl shadow-blue-600/20 tracking-widest"
              >
                Zakończ i Zapisz
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppLayout>
  );
};

export default Workout;