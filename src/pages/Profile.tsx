import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, LogOut, Sun, Moon, Shield, ChevronLeft, 
  Scale, Ruler, Target, Activity, Trash2, Save, Settings,
  Zap, Bell, Smartphone, UserCircle
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import * as Store from "@/lib/user-store";
import { motion, AnimatePresence } from "framer-motion";

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
      if (data.theme === 'dark') document.documentElement.classList.add('dark');
      setLoading(false);
    }
  }, [navigate]);

  // Blokada scrollowania tła
  useEffect(() => {
    if (editingField) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [editingField]);

  if (loading || !profile) return <div className="min-h-screen bg-black" />;

  const toggleTheme = () => {
    const newTheme = profile.theme === 'dark' ? 'light' : 'dark';
    Store.updateExtendedProfile({ theme: newTheme });
    document.documentElement.classList.toggle('dark');
    setProfile({ ...profile, theme: newTheme });
  };

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

  const activityLabels: any = {
    1: "Siedzący",
    2: "Lekka",
    3: "Umiarkowana",
    4: "Wysoka",
    5: "Ekstremalna"
  };

  const goalLabels: any = {
    cut: "Redukcja",
    bulk: "Masa",
    recomp: "Re維持 (Recomp)"
  };

  return (
    <AppLayout>
      <div className={`px-5 pt-12 pb-32 min-h-screen transition-all ${profile.theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'}`}>
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROFIL</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mt-2">Elite User Settings</p>
          </div>
          <button onClick={toggleTheme} className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-2xl shadow-xl shadow-blue-500/5">
            {profile.theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
          </button>
        </header>

        {/* AVATAR CARD */}
        <section className="p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex flex-col items-center gap-4 text-center mb-8 shadow-2xl shadow-black/5">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-4 border-blue-600 overflow-hidden shadow-2xl">
               {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <UserCircle size={64} className="text-zinc-300 dark:text-zinc-600" />}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 rounded-2xl text-white shadow-lg border-4 border-white dark:border-zinc-900">
              <Zap size={16} fill="white" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic leading-tight">{profile.name}</h2>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Kilo Member od {new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>
        </section>

        {/* SETTINGS GRID */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-2">Parametry Fizyczne</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => startEditing('weight', profile.weight)} className="p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 text-left flex flex-col gap-2">
              <Scale size={20} className="text-blue-500" />
              <p className="text-[10px] font-black text-zinc-500 uppercase">Waga</p>
              <p className="text-2xl font-black italic">{profile.weight}kg</p>
            </button>

            <button onClick={() => startEditing('height', profile.height)} className="p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 text-left flex flex-col gap-2">
              <Ruler size={20} className="text-blue-500" />
              <p className="text-[10px] font-black text-zinc-500 uppercase">Wzrost</p>
              <p className="text-2xl font-black italic">{profile.height}cm</p>
            </button>
          </div>

          <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest px-2 mt-8">Cele i Aktywność</h3>
          
          <button onClick={() => startEditing('goal', profile.goal)} className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600/10 rounded-2xl"><Target className="text-blue-500" /></div>
              <div className="text-left">
                <p className="text-[9px] font-black text-zinc-500 uppercase">Twój Cel</p>
                <p className="text-lg font-black italic uppercase">{goalLabels[profile.goal]}</p>
              </div>
            </div>
            <Settings size={18} className="text-zinc-300" />
          </button>

          <button onClick={() => startEditing('activityLevel', profile.activityLevel)} className="w-full p-6 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600/10 rounded-2xl"><Activity className="text-emerald-500" /></div>
              <div className="text-left">
                <p className="text-[9px] font-black text-zinc-500 uppercase">Poziom Aktywności</p>
                <p className="text-lg font-black italic uppercase">{activityLabels[profile.activityLevel]}</p>
              </div>
            </div>
            <Settings size={18} className="text-zinc-300" />
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="mt-12 space-y-4">
          <h3 className="text-xs font-black uppercase text-red-500 tracking-widest px-2">Strefa Bezpieczeństwa</h3>
          <button 
            onClick={() => { if(confirm("Czy na pewno chcesz usunąć wszystkie dane? Ta operacja jest nieodwracalna.")) Store.clearUserProfile(); }}
            className="w-full p-6 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex justify-between items-center text-red-500 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/20 rounded-2xl"><Trash2 size={20} /></div>
              <span className="font-black uppercase italic tracking-widest text-sm">Zresetuj Dane</span>
            </div>
            <LogOut size={20} />
          </button>
        </div>

        {/* MODAL EDYCJI (FULLSCREEN) */}
        <AnimatePresence>
          {editingField && (
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              className="fixed inset-0 z-[600] bg-white dark:bg-black p-6 flex flex-col overflow-hidden"
            >
              <header className="flex justify-between items-center mb-12">
                <button onClick={() => setEditingField(null)}><ChevronLeft size={32} /></button>
                <h2 className="font-black uppercase italic tracking-tighter">Edytuj {editingField}</h2>
                <button onClick={saveEdit} className="p-3 bg-blue-600 rounded-2xl text-white font-black uppercase text-xs">Zapisz</button>
              </header>

              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                {editingField === 'weight' || editingField === 'height' ? (
                  <div className="text-center">
                    <input 
                      type="number" 
                      className="bg-transparent text-8xl font-black italic text-center outline-none border-b-4 border-blue-600 pb-2 w-full tabular-nums"
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      autoFocus
                    />
                    <p className="text-xl font-black uppercase text-zinc-500 mt-4 italic">{editingField === 'weight' ? 'Kilogramy' : 'Centymetry'}</p>
                  </div>
                ) : editingField === 'goal' ? (
                  <div className="w-full space-y-4">
                    {['cut', 'bulk', 'recomp'].map((g) => (
                      <button 
                        key={g}
                        onClick={() => setTempValue(g)}
                        className={`w-full p-8 rounded-[2.5rem] border-2 transition-all font-black uppercase italic text-xl ${tempValue === g ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-100 dark:border-zinc-800'}`}
                      >
                        {goalLabels[g]}
                      </button>
                    ))}
                  </div>
                ) : editingField === 'activityLevel' ? (
                   <div className="w-full space-y-3">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button 
                        key={lvl}
                        onClick={() => setTempValue(lvl)}
                        className={`w-full p-6 rounded-[2rem] border-2 transition-all font-black uppercase italic text-sm ${tempValue === lvl ? 'border-emerald-600 bg-emerald-600/10' : 'border-zinc-100 dark:border-zinc-800'}`}
                      >
                        {activityLabels[lvl]}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Profile;