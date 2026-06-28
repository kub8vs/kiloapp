import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut, Shield, ChevronLeft, 
  Scale, Ruler, Target, Activity, Trash2, Settings,
  Zap, UserCircle, Watch, ChevronRight, Smartphone, 
  Bluetooth, BarChart3, TrendingUp, Heart,
  Brain, Dna, ShieldCheck, Loader2, Info, Activity as ActivityIcon, Sun, Moon
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import * as Store from "@/lib/user-store";
import type { HistoryEntry } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Store.UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | number>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [weightLog, setWeightLog] = useState<Store.WeightEntry[]>([]);

  useEffect(() => {
    const data = Store.getUserProfile();
    if (!data) {
      navigate('/onboarding');
    } else {
      setProfile(data);
      // Realne dane: zapisz dzisiejszą wagę do trendu i wczytaj historię treningów.
      setWeightLog(Store.addWeightEntry(data.weight));
      setHistory(Store.getWorkoutHistory());
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = editingField ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [editingField]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="text-brand animate-spin" size={48} />
          <div className="absolute inset-0 blur-xl bg-brand/20 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.5em] mb-2">System Booting</p>
          <p className="text-muted-foreground text-[8px] font-bold uppercase tracking-widest">Elite Biometric Interface v4.0</p>
        </div>
      </div>
    );
  }

  const startEditing = (field: string, currentVal: string | number) => {
    setEditingField(field);
    setTempValue(currentVal);
  };

  const saveEdit = () => {
    if (!profile) return;
    const updates = { [editingField!]: tempValue } as Partial<Store.UserProfile>;
    Store.updateExtendedProfile(updates);
    setProfile({ ...profile, ...updates });
    if (editingField === 'weight') setWeightLog(Store.addWeightEntry(Number(tempValue)));
    setEditingField(null);
  };

  const handleLogout = () => navigate('/onboarding');

  const activityLabels: Record<number, string> = { 1: "Siedzący", 2: "Lekka", 3: "Umiarkowana", 4: "Wysoka", 5: "Ekstremalna" };
  const goalLabels: Record<string, string> = { cut: "Redukcja", bulk: "Masa", recomp: "Recomp" };

  // --- KOMPONENTY WYKRESÓW (realne dane z historii i logu wagi) ---
  const EmptyChart = ({ text }: { text: string }) => (
    <div className="h-32 w-full flex items-center justify-center border border-dashed border-foreground/10 rounded-2xl">
      <p className="text-[10px] text-muted-foreground uppercase font-bold italic text-center px-6">{text}</p>
    </div>
  );

  const strengthVols = history.filter((h) => h.type !== 'cardio').slice(-7).map((h) => h.vol || 0);
  const strengthDelta =
    strengthVols.length >= 2 && strengthVols[0] > 0
      ? Math.round(((strengthVols[strengthVols.length - 1] - strengthVols[0]) / strengthVols[0]) * 100)
      : null;
  const weightDelta =
    weightLog.length >= 2 ? +(weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(1) : null;

  const StrengthChart = () => {
    if (strengthVols.length === 0) return <EmptyChart text="Dodaj trening siłowy, aby zobaczyć progres" />;
    const max = Math.max(...strengthVols, 1);
    return (
      <div className="h-32 w-full flex items-end justify-between gap-1.5 px-2">
        {strengthVols.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-gradient-to-t from-brand to-brand rounded-t-md shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000"
              style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
    );
  };

  const WeightChart = () => {
    const points = weightLog.slice(-7);
    if (points.length === 0) return <EmptyChart text="Zapisz wagę, aby zobaczyć trend" />;
    const weights = points.map((p) => p.weight);
    const max = Math.max(...weights);
    const min = Math.min(...weights);
    const range = max - min || 1;
    return (
      <div className="h-32 w-full flex items-end justify-between gap-3 px-4">
        {points.map((p, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground mb-1" />
            <div
              className="w-full bg-secondary rounded-t-xl border-x border-t border-foreground/5 transition-all duration-1000"
              style={{ height: `${40 + ((p.weight - min) / range) * 55}%` }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="dark px-5 pt-12 pb-32 min-h-screen bg-background text-foreground">
        
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROFIL</h1>
            <p className="text-[10px] font-bold text-brand uppercase tracking-[0.2em] mt-2">Personal Elite Dashboard</p>
          </div>
        </header>

        {/* AVATAR CARD */}
        <section className="p-8 rounded-[3rem] bg-card border border-foreground/10 flex flex-col items-center gap-4 text-center mb-8 shadow-2xl">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-secondary flex items-center justify-center border-4 border-brand overflow-hidden shadow-2xl transition-transform group-active:scale-95">
               {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <UserCircle size={64} className="text-muted-foreground" />}
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-brand rounded-2xl text-foreground shadow-lg border-4 border-border animate-bounce-slow">
              <Zap size={16} fill="white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic leading-tight">{profile.name}</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Kilo Elite Member</p>
          </div>
        </section>

        {/* --- SYSTEM INTELLIGENCE SECTION --- */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest px-2">Data Intelligence</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="relative w-full group active:scale-[0.98] transition-all">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition" />
                <div className="relative w-full p-6 bg-card rounded-[2.5rem] border border-foreground/10 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-left">
                    <div className="p-4 bg-brand rounded-2xl shadow-xl shadow-brand/20">
                      <Brain size={24} className="text-foreground" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-brand uppercase tracking-widest">Neural Analysis</p>
                      <p className="text-xl font-black italic uppercase leading-none mt-1">System Reports</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-muted-foreground" />
                </div>
              </button>
            </DrawerTrigger>
            
            <DrawerContent className="bg-card border-t-border text-foreground h-[95vh]">
              <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
                <DrawerHeader className="border-b border-foreground/5 pb-4">
                  <DrawerTitle className="text-3xl font-black uppercase italic text-center tracking-tighter">Bio-Intelligence</DrawerTitle>
                  <DrawerDescription className="text-center text-muted-foreground font-bold uppercase text-[9px] tracking-[0.4em]">Integrated Performance Analytics</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-12 pb-20 custom-scrollbar">
                  
                  {/* 1. SIŁA */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="text-brand" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Postępy Siłowe</h4>
                      </div>
                      <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-1 rounded-md">{strengthDelta !== null ? `${strengthDelta > 0 ? '+' : ''}${strengthDelta}%` : '—'}</span>
                    </div>
                    <div className="p-5 bg-card rounded-[2rem] border border-foreground/5">
                      <StrengthChart />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase">
                      <ShieldCheck className="inline mr-1 text-brand" size={12} /> Wzrost objętości treningowej sugeruje optymalną adaptację CNS.
                    </p>
                  </div>

                  {/* 2. TĘTNO */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Heart className="text-emerald-500" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Tętno Spoczynkowe</h4>
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md">BRAK DANYCH</span>
                    </div>
                    <div className="p-5 bg-card rounded-[2rem] border border-foreground/5">
                      <EmptyChart text="Połącz zegarek, aby śledzić tętno spoczynkowe" />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase">
                      <Info className="inline mr-1 text-emerald-500" size={12} /> Dane tętna pojawią się po połączeniu urządzenia.
                    </p>
                  </div>

                  {/* 3. MASA CIAŁA */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Scale className="text-foreground" size={18} />
                        <h4 className="text-xs font-black uppercase italic tracking-widest">Masa Ciała (Kg)</h4>
                      </div>
                      <span className="text-[10px] font-black text-foreground bg-foreground/10 px-2 py-1 rounded-md">{weightDelta === null ? 'TREND —' : weightDelta <= 0 ? `TREND ↓ ${weightDelta}kg` : `TREND ↑ +${weightDelta}kg`}</span>
                    </div>
                    <div className="p-5 bg-card rounded-[2rem] border border-foreground/5">
                      <WeightChart />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase text-center">
                      Analiza składu ciała sugeruje efektywną rekompozycję.
                    </p>
                  </div>

                </div>
                <DrawerClose asChild>
                  <button className="p-6 text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:text-foreground transition-colors">Zamknij Analizy</button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* --- INTEGRATIONS --- */}
        <div className="mb-8 space-y-4">
          <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest px-2">Connect Devices</h3>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="w-full p-6 bg-card rounded-[2.5rem] border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand/10 rounded-2xl"><Watch className="text-brand" /></div>
                  <div className="text-left">
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Synchronizacja</p>
                    <p className="text-lg font-black italic uppercase">Połącz zegarek</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-card text-foreground">
               <div className="mx-auto w-full max-w-sm pb-10">
                <DrawerHeader><DrawerTitle className="text-2xl font-black uppercase italic text-center">Select Wearable</DrawerTitle></DrawerHeader>
                <div className="p-4 space-y-3">
                  {[{ name: 'Apple Watch', icon: <Smartphone /> }, { name: 'Samsung Health', icon: <Watch /> }, { name: 'Garmin Connect', icon: <Bluetooth /> }].map((d) => (
                    <div key={d.name} className="w-full p-6 bg-card rounded-3xl border border-foreground/5 flex items-center justify-between font-black uppercase italic text-sm opacity-70">
                      <div className="flex items-center gap-4">{d.icon} {d.name}</div>
                      <div className="text-[10px] text-muted-foreground border border-foreground/10 px-3 py-1 rounded-full">Wkrótce</div>
                    </div>
                  ))}
                </div>
               </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* --- PHYSICAL PARAMETERS --- */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest px-2">Parametry</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => startEditing('weight', profile.weight)} className="p-6 bg-card rounded-[2.5rem] border border-foreground/10 text-left flex flex-col gap-2">
              <Scale size={20} className="text-brand" />
              <p className="text-[10px] font-black text-muted-foreground uppercase">Waga</p>
              <p className="text-2xl font-black italic">{profile.weight}kg</p>
            </button>
            <button onClick={() => startEditing('height', profile.height)} className="p-6 bg-card rounded-[2.5rem] border border-foreground/10 text-left flex flex-col gap-2">
              <Ruler size={20} className="text-brand" />
              <p className="text-[10px] font-black text-muted-foreground uppercase">Wzrost</p>
              <p className="text-2xl font-black italic">{profile.height}cm</p>
            </button>
          </div>
        </div>

        {/* --- MOTYW --- */}
        <div className="mt-8 space-y-4">
          <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest px-2">Wygląd</h3>
          <div className="p-2 bg-card rounded-[2rem] border border-foreground/10 flex gap-2">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
              <Moon size={16} /> Ciemny
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}
            >
              <Sun size={16} /> Jasny
            </button>
          </div>
        </div>

        {/* --- LOGOUT & RESET --- */}
        <div className="mt-12 space-y-4">
          <button onClick={handleLogout} className="w-full p-6 bg-card rounded-[2.5rem] border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-2xl"><LogOut className="text-muted-foreground" /></div>
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
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[600] bg-background p-6 flex flex-col overflow-hidden text-foreground">
              <header className="flex justify-between items-center mb-12">
                <button onClick={() => setEditingField(null)}><ChevronLeft size={32} /></button>
                <h2 className="font-black uppercase italic tracking-tighter text-xl">Edytuj</h2>
                <button onClick={saveEdit} className="px-5 py-2 bg-brand rounded-2xl text-foreground font-black uppercase text-xs">Zapisz</button>
              </header>
              <div className="flex-1 flex flex-col items-center justify-center">
                {(editingField === 'weight' || editingField === 'height') && (
                  <div className="w-full flex flex-col items-center">
                    <input type="number" className="bg-transparent text-8xl font-black italic text-center outline-none border-b-4 border-brand pb-2 w-full text-foreground tabular-nums" value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
                    <p className="text-xl font-black uppercase text-muted-foreground mt-6 italic">{editingField === 'weight' ? 'Kilogramy (kg)' : 'Centymetry (cm)'}</p>
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