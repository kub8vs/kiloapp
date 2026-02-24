import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut, Shield, ChevronLeft, 
  Scale, Ruler, Target, Activity, Trash2, Settings,
  Zap, UserCircle, Watch, ChevronRight, Smartphone, 
  Bluetooth, BarChart3, TrendingUp, Heart,
  Brain, Dna, ShieldCheck, Loader2, Info, Activity as ActivityIcon
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import * as Store from "@/lib/user-store";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<any>(null);

  useEffect(() => {
    const data = Store.getUserProfile();
    if (!data) {
      navigate('/onboarding');
    } else {
      setProfile(data);
      // Symulacja ładowania systemów biometrycznych
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = editingField ? 'hidden' : 'auto';
  }, [editingField]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="text-blue-600 animate-spin" size={48} />
          <div className="absolute inset-0 blur-xl bg-blue-600/20 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2">System Booting</p>
          <p className="text-zinc-500 text-[8px] font-bold uppercase tracking-widest">Elite Biometric Interface v4.0</p>
        </div>
      </div>
    );
  }

  const startEditing = (field: string, currentVal: any) => {
    setEditingField(field);
    setTempValue(currentVal);
  };

  const saveEdit = () => {
    const updates = { [editingField!]: tempValue };
    Store.updateExtendedProfile(updates);
    setProfile({ ...profile, ...updates });
    setEditingField(null);
  };

  const handleLogout = () => navigate('/onboarding');

  const activityLabels: any = { 1: "Siedzący", 2: "Lekka", 3: "Umiarkowana", 4: "Wysoka", 5: "Ekstremalna" };
  const goalLabels: any = { cut: "Redukcja", bulk: "Masa", recomp: "Recomp" };

  // --- KOMPONENTY WYKRESÓW (Custom SVG/Tailwind) ---
  const StrengthChart = () => (
    <div className="h-32 w-full flex items-end justify-between gap-1.5 px-2">
      {[35, 45, 40, 65, 85, 75, 95].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000" 
            style={{ height: `${h}%` }} 
          />
        </div>
      ))}
    </div>
  );

  const HeartRateChart = () => (
    <div className="h-32 w-full relative flex items-center px-2">
      <svg className="w-full h-full overflow-visible">
        <path 
          d="M0 60 L40 55 L80 65 L120 40 L160 30 L200 45 L240 20 L300 15" 
          fill="none" 
          stroke="#10b981" 
          strokeWidth="3" 
          strokeLinecap="round"
          className="animate-draw"
        />
        <circle cx="240" cy="20" r="4" fill="#10b981" className="animate-pulse" />
      </svg>
    </div>
  );

  const WeightChart = () => (
    <div className="h-32 w-full flex items-end justify-between gap-3 px-4">
      {[90, 88, 87, 86, 84.5, 83.8, 83].map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-zinc-400 mb-1" />
          <div 
            className="w-full bg-zinc-800 rounded-t-xl border-x border-t border-white/5" 
            style={{ height: `${(v/90)*100}%` }} 
          />
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="dark px-5 pt-12 pb-32 min-h-screen bg-black text-white">
        
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROFIL</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-2">Personal Elite Dashboard</p>
          </div>
        </header>

        {/* AVATAR CARD */}
        <section className="p-8 rounded-[3rem] bg-zinc-900 border border-white/10 flex flex-col items-center gap-4 text-center mb-8 shadow-2xl">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-800 flex items-center justify-center border-4 border-blue-600 overflow-hidden shadow-2xl transition-transform group-active:scale-95">
               {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <UserCircle size={64} className="text-zinc-700" />}
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl text-white shadow-lg border-4 border-zinc-900 animate-bounce-slow">
              <Zap size={16} fill="white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic leading-tight">{profile.name}</h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Kilo Elite Member</p>
          </div>
        </section>

        {/* --- SYSTEM INTELLIGENCE SECTION --- */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-2">Data Intelligence</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="relative w-full group active:scale-[0.98] transition-all">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition" />
                <div className="relative w-full p-6 bg-zinc-900 rounded-[2.5rem] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20">
                      <Brain size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Neural Analysis</p>
                      <p className="text-xl font-black italic uppercase leading-none mt-1">System Reports</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-zinc-700" />
                </div>
              </button>
            </DrawerTrigger>
            
            <DrawerContent className="bg-zinc-950 border-t-zinc-800 text-white h-[95vh]">
              <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
                <DrawerHeader className="border-b border-white/5 pb-4">
                  <DrawerTitle className="text-3xl font-black uppercase italic text-center tracking-tighter">Bio-Intelligence</DrawerTitle>
                  <DrawerDescription className="text-center text-zinc-500 font-bold uppercase text-[9px] tracking-[0.4em]">Integrated Performance Analytics</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-12 pb-20 custom-scrollbar">
                  
                  {/* 1. SIŁA */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-blue-500" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Postępy Siłowe</h4>
                      </div>
                      <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-1 rounded-md">+14.2%</span>
                    </div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5">
                      <StrengthChart />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase">
                      <ShieldCheck className="inline mr-1 text-blue-500" size={12} /> Wzrost objętości treningowej sugeruje optymalną adaptację CNS.
                    </p>
                  </div>

                  {/* 2. TĘTNO */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Heart className="text-emerald-500" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Tętno Spoczynkowe</h4>
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">-4 BPM</span>
                    </div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5">
                      <HeartRateChart />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase">
                      <Info className="inline mr-1 text-emerald-500" size={12} /> Stabilizacja tętna wskazuje na wysoką gotowość metaboliczną.
                    </p>
                  </div>

                  {/* 3. MASA CIAŁA */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Scale className="text-zinc-100" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Masa Ciała (Kg)</h4>
                      </div>
                      <span className="text-[10px] font-black text-zinc-100 bg-white/10 px-2 py-1 rounded-md">TREND ↓</span>
                    </div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5">
                      <WeightChart />
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase text-center">
                      Analiza składu ciała sugeruje efektywną rekompozycję.
                    </p>
                  </div>

                </div>
                <DrawerClose asChild>
                  <button className="p-6 text-zinc-600 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Zamknij Analizy</button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* --- INTEGRATIONS --- */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-2">Connect Devices</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="w-full p-6 bg-zinc-900 rounded-[2.5rem] border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 rounded-2xl"><Watch className="text-blue-500" /></div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-zinc-500 uppercase">Synchronizacja</p>
                    <p className="text-lg font-black italic uppercase">Połącz zegarek</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-700" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-zinc-950 text-white">
               <div className="mx-auto w-full max-w-sm pb-10">
                <DrawerHeader><DrawerTitle className="text-2xl font-black uppercase italic text-center">Select Wearable</DrawerTitle></DrawerHeader>
                <div className="p-4 space-y-3">
                  {[{ name: 'Apple Watch', icon: <Smartphone /> }, { name: 'Samsung Health', icon: <Watch /> }, { name: 'Garmin Connect', icon: <Bluetooth /> }].map((d) => (
                    <button key={d.name} className="w-full p-6 bg-zinc-900 rounded-3xl border border-white/5 flex items-center justify-between font-black uppercase italic text-sm">
                      <div className="flex items-center gap-4">{d.icon} {d.name}</div>
                      <div className="text-[10px] text-blue-500 border border-blue-500/30 px-3 py-1 rounded-full">Połącz</div>
                    </button>
                  ))}
                </div>
               </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* --- PHYSICAL PARAMETERS --- */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-2">Parametry</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => startEditing('weight', profile.weight)} className="p-6 bg-zinc-900 rounded-[2.5rem] border border-white/10 text-left flex flex-col gap-2">
              <Scale size={20} className="text-blue-500" />
              <p className="text-[10px] font-black text-zinc-500 uppercase">Waga</p>
              <p className="text-2xl font-black italic">{profile.weight}kg</p>
            </button>
            <button onClick={() => startEditing('height', profile.height)} className="p-6 bg-zinc-900 rounded-[2.5rem] border border-white/10 text-left flex flex-col gap-2">
              <Ruler size={20} className="text-blue-500" />
              <p className="text-[10px] font-black text-zinc-500 uppercase">Wzrost</p>
              <p className="text-2xl font-black italic">{profile.height}cm</p>
            </button>
          </div>
        </div>

        {/* --- LOGOUT & RESET --- */}
        <div className="mt-12 space-y-4">
          <button onClick={handleLogout} className="w-full p-6 bg-zinc-900 rounded-[2.5rem] border border-white/10 flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-800 rounded-2xl"><LogOut className="text-zinc-500" /></div>
              <span className="font-black uppercase italic text-sm">Wyloguj Się</span>
            </div>
          </button>
          <button onClick={() => { if(confirm("Confirm data reset?")) Store.clearUserProfile(); }} className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex justify-between items-center text-red-500 active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-2xl"><Trash2 size={20} /></div>
              <span className="font-black uppercase italic text-sm">Zresetuj Dane</span>
            </div>
          </button>
        </div>

        {/* MODAL EDYCJI */}
        <AnimatePresence>
          {editingField && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[600] bg-black p-6 flex flex-col overflow-hidden text-white">
              <header className="flex justify-between items-center mb-12">
                <button onClick={() => setEditingField(null)}><ChevronLeft size={32} /></button>
                <h2 className="font-black uppercase italic tracking-tighter text-xl">Edytuj</h2>
                <button onClick={saveEdit} className="px-5 py-2 bg-blue-600 rounded-2xl text-white font-black uppercase text-xs">Zapisz</button>
              </header>
              <div className="flex-1 flex flex-col items-center justify-center">
                {(editingField === 'weight' || editingField === 'height') && (
                  <div className="w-full flex flex-col items-center">
                    <input type="number" className="bg-transparent text-8xl font-black italic text-center outline-none border-b-4 border-blue-600 pb-2 w-full text-white tabular-nums" value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
                    <p className="text-xl font-black uppercase text-zinc-500 mt-6 italic">{editingField === 'weight' ? 'Kilogramy (kg)' : 'Centymetry (cm)'}</p>
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

export default Profile;