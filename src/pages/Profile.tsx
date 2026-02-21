import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut, Shield, ChevronLeft, 
  Scale, Ruler, Target, Activity, Trash2, Settings,
  Zap, UserCircle, Watch, ChevronRight, Smartphone, 
  Bluetooth, BarChart3, FileText, TrendingUp, Heart,
  Brain, Dna, ShieldCheck, Loader2, Info, Activity as ActivityIcon, Printer
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
  const handlePrint = () => window.print();

  const activityLabels: any = { 1: "Siedzący", 2: "Lekka", 3: "Umiarkowana", 4: "Wysoka", 5: "Ekstremalna" };
  const goalLabels: any = { cut: "Redukcja", bulk: "Masa", recomp: "Recomp" };

  // --- KOMPONENTY WYKRESÓW (Custom SVG/Tailwind) ---
  const StrengthChart = ({ isPrint = false }) => (
    <div className={`${isPrint ? 'h-48' : 'h-32'} w-full flex items-end justify-between gap-1.5 px-2`}>
      {[35, 45, 40, 65, 85, 75, 95].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div 
            className={`w-full ${isPrint ? 'bg-blue-600' : 'bg-gradient-to-t from-blue-700 to-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.3)]'} rounded-t-md transition-all duration-1000`} 
            style={{ height: `${h}%` }} 
          />
        </div>
      ))}
    </div>
  );

  const HeartRateChart = ({ isPrint = false }) => (
    <div className={`${isPrint ? 'h-48' : 'h-32'} w-full relative flex items-center px-2`}>
      <svg className="w-full h-full overflow-visible">
        <path 
          d="M0 60 L40 55 L80 65 L120 40 L160 30 L200 45 L240 20 L300 15" 
          fill="none" 
          stroke={isPrint ? "#000" : "#10b981"} 
          strokeWidth="3" 
          strokeLinecap="round"
          className={!isPrint ? "animate-draw" : ""}
        />
        <circle cx="240" cy="20" r="4" fill={isPrint ? "#000" : "#10b981"} className={!isPrint ? "animate-pulse" : ""} />
      </svg>
    </div>
  );

  const WeightChart = ({ isPrint = false }) => (
    <div className={`${isPrint ? 'h-48' : 'h-32'} w-full flex items-end justify-between gap-3 px-4`}>
      {[90, 88, 87, 86, 84.5, 83.8, 83].map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          {!isPrint && <div className="w-2 h-2 rounded-full bg-zinc-400 mb-1" />}
          <div 
            className={`w-full ${isPrint ? 'bg-zinc-200 border border-zinc-400' : 'bg-zinc-800 border-x border-t border-white/5'} rounded-t-xl`} 
            style={{ height: `${(v/90)*100}%` }} 
          />
        </div>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; padding: 0 !important; }
          @page { margin: 1.5cm; }
          .report-card { border: 1px solid #e5e7eb; page-break-inside: avoid; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="dark px-5 pt-12 pb-32 min-h-screen bg-black text-white no-print">
        
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
              <div className="mx-auto w-full max-md flex flex-col h-full overflow-hidden">
                <DrawerHeader className="border-b border-white/5 pb-4">
                  <DrawerTitle className="text-3xl font-black uppercase italic text-center tracking-tighter">Bio-Intelligence</DrawerTitle>
                  <DrawerDescription className="text-center text-zinc-500 font-bold uppercase text-[9px] tracking-[0.4em]">Integrated Performance Analytics</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-12 pb-20 custom-scrollbar">
                  
                  {/* VISUALS FOR DRAWER */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end"><h4 className="text-xs font-black uppercase italic tracking-widest">Postępy Siłowe</h4></div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5"><StrengthChart /></div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end"><h4 className="text-xs font-black uppercase italic tracking-widest">Tętno Spoczynkowe</h4></div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5"><HeartRateChart /></div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end"><h4 className="text-xs font-black uppercase italic tracking-widest">Masa Ciała (Kg)</h4></div>
                    <div className="p-5 bg-zinc-900 rounded-[2rem] border border-white/5"><WeightChart /></div>
                  </div>

                  {/* PDF BUTTON */}
                  <button 
                    onClick={handlePrint}
                    className="w-full py-8 bg-white text-black rounded-[2.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-white/5"
                  >
                    <Printer size={20} strokeWidth={3} />
                    <span className="font-black uppercase italic tracking-widest">Generuj Raport PDF</span>
                  </button>

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

      {/* --- PROFESSIONAL PRINT TEMPLATE (PDF ONLY) --- */}
      <div className="print-only bg-white text-black p-10 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b-8 border-black pb-10 mb-12">
          <div>
            <h1 className="text-7xl font-black italic tracking-tighter leading-none">KILO</h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mt-2">Elite Performance Intelligence</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black uppercase">{profile.name}</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Raport Wygenerowany: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* SECTION 1: STRENGTH */}
        <div className="report-card p-10 rounded-[3rem] mb-10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black uppercase italic">01. Analiza Progresji Siłowej</h2>
            <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase">Status: Optimal</span>
          </div>
          <StrengthChart isPrint />
          <div className="mt-10 grid grid-cols-2 gap-12 border-t border-zinc-100 pt-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Interpretacja Danych</p>
              <p className="text-sm leading-relaxed font-medium italic text-zinc-800">System wykrył systematyczny wzrost objętości treningowej (Total Volume). Krzywa progresji wskazuje na skuteczną rekrutację jednostek motorycznych wysokoprogowych.</p>
            </div>
            <div className="bg-zinc-50 p-6 rounded-[2rem] border-l-4 border-blue-600">
              <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Elite Pro-Tip</p>
              <p className="text-xs font-bold leading-relaxed uppercase italic">Zastosuj periodyzację falową w kolejnym mikrocyklu. Zmniejszenie objętości o 20% przy zachowaniu intensywności pozwoli na pełną superkompensację tkanki łącznej.</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: HEART RATE */}
        <div className="report-card p-10 rounded-[3rem] mb-10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black uppercase italic">02. Wydolność i Regeneracja CNS</h2>
            <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full uppercase">Biometric: Verified</span>
          </div>
          <HeartRateChart isPrint />
          <div className="mt-10 grid grid-cols-2 gap-12 border-t border-zinc-100 pt-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Wskaźnik Homeostazy</p>
              <p className="text-sm leading-relaxed font-medium italic text-zinc-800">Stabilizacja tętna spoczynkowego na niskim poziomie świadczy o wysokiej adaptacji układu przywspółczulnego i optymalnej regeneracji pomiędzy sesjami.</p>
            </div>
            <div className="bg-zinc-50 p-6 rounded-[2rem] border-l-4 border-zinc-900">
              <p className="text-[10px] font-black uppercase text-zinc-900 mb-2">Elite Pro-Tip</p>
              <p className="text-xs font-bold leading-relaxed uppercase italic">Wprowadź protokół 10 min medytacji Box Breathing (4s wdech / 4s stop / 4s wydech) bezpośrednio po sesji siłowej, aby szybciej obniżyć poziom kortyzolu.</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: WEIGHT */}
        <div className="report-card p-10 rounded-[3rem] mb-10">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black uppercase italic">03. Kontrola Kompozycji Ciała</h2>
            <span className="text-[10px] font-black border-2 border-black px-3 py-1 rounded-full uppercase text-sm">Cel: {goalLabels[profile.goal]}</span>
          </div>
          <WeightChart isPrint />
          <div className="mt-10 grid grid-cols-2 gap-12 border-t border-zinc-100 pt-8">
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Analiza Trendu</p>
              <p className="text-sm leading-relaxed font-medium italic text-zinc-800">Spadek masy przy jednoczesnym wzroście siły (Sekcja 01) potwierdza efektywną rekompozycję składu ciała i utratę zbędnej tkanki tłuszczowej.</p>
            </div>
            <div className="bg-zinc-50 p-6 rounded-[2rem] border-l-4 border-zinc-400">
              <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Elite Pro-Tip</p>
              <p className="text-xs font-bold leading-relaxed uppercase italic">Zwiększ podaż leucyny w posiłku po-treningowym do 3g. Wspomoże to syntezę białek mięśniowych w fazie deficytu kalorycznego.</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-20 text-center">
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-300 italic">Generated by KILO Intelligence System v4.0.1 • Biometric Authenticated Document</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;