import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut, ChevronLeft, ChevronRight, Scale, Ruler, Trash2, UserCircle,
  Watch, Smartphone, Bluetooth, TrendingUp, Heart, Brain, ShieldCheck,
  Loader2, Sun, Moon, Bell, Camera, MapPin, Check, User, Activity,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import * as Store from "@/lib/user-store";
import { ACTIVITY_LEVELS } from "@/lib/nutrition";
import type { HistoryEntry } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";

const goalLabels: Record<string, string> = { cut: "Redukcja", bulk: "Masa", recomp: "Recomp" };
const APP_VERSION = "1.0.0";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Store.UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string | number>('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [weightLog, setWeightLog] = useState<Store.WeightEntry[]>([]);
  const [notifications, setNotifications] = useState(() => localStorage.getItem('kilo_notifications') === 'true');
  const [camPerm, setCamPerm] = useState<string>('prompt');
  const [locPerm, setLocPerm] = useState<string>('prompt');

  useEffect(() => {
    const data = Store.getUserProfile();
    if (!data) {
      navigate('/onboarding');
    } else {
      setProfile(data);
      setWeightLog(Store.addWeightEntry(data.weight));
      setHistory(Store.getWorkoutHistory());
      const timer = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  // Status uprawnień (jeśli przeglądarka/WebView wspiera Permissions API)
  useEffect(() => {
    const anyNav = navigator as Navigator & { permissions?: { query: (d: { name: PermissionName }) => Promise<PermissionStatus> } };
    if (!anyNav.permissions?.query) return;
    anyNav.permissions.query({ name: 'camera' as PermissionName }).then((p) => { setCamPerm(p.state); p.onchange = () => setCamPerm(p.state); }).catch(() => {});
    anyNav.permissions.query({ name: 'geolocation' as PermissionName }).then((p) => { setLocPerm(p.state); p.onchange = () => setLocPerm(p.state); }).catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = editingField ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [editingField]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5">
        <Loader2 className="animate-spin" size={40} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">KILO</p>
      </div>
    );
  }

  const startEditing = (field: string, currentVal: string | number) => {
    setEditingField(field);
    setTempValue(currentVal);
  };

  const updateField = (field: keyof Store.UserProfile, value: string | number) => {
    if (!profile) return;
    const updates = { [field]: value } as Partial<Store.UserProfile>;
    Store.updateExtendedProfile(updates);
    setProfile({ ...profile, ...updates });
    if (field === 'weight') setWeightLog(Store.addWeightEntry(Number(value)));
  };

  const saveEdit = () => {
    if (!editingField) return;
    const isNumeric = editingField === 'weight' || editingField === 'height' || editingField === 'age';
    updateField(editingField as keyof Store.UserProfile, isNumeric ? Number(tempValue) : String(tempValue));
    setEditingField(null);
  };

  const toggleNotifications = () => {
    const next = !notifications;
    setNotifications(next);
    localStorage.setItem('kilo_notifications', String(next));
  };

  const requestCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      s.getTracks().forEach((t) => t.stop());
      setCamPerm('granted');
    } catch { setCamPerm('denied'); }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(() => setLocPerm('granted'), () => setLocPerm('denied'));
  };

  const permLabel = (s: string) => (s === 'granted' ? 'Przyznano' : s === 'denied' ? 'Odmowa' : 'Włącz');

  const handleLogout = () => navigate('/onboarding');

  // --- WYKRESY (realne dane, monochromatyczne) ---
  const EmptyChart = ({ text }: { text: string }) => (
    <div className="h-32 w-full flex items-center justify-center border border-dashed border-foreground/15 rounded-2xl">
      <p className="text-[10px] text-muted-foreground uppercase font-bold italic text-center px-6">{text}</p>
    </div>
  );

  const strengthVols = history.filter((h) => h.type !== 'cardio').slice(-7).map((h) => h.vol || 0);
  const strengthDelta = strengthVols.length >= 2 && strengthVols[0] > 0
    ? Math.round(((strengthVols[strengthVols.length - 1] - strengthVols[0]) / strengthVols[0]) * 100) : null;
  const weightDelta = weightLog.length >= 2 ? +(weightLog[weightLog.length - 1].weight - weightLog[0].weight).toFixed(1) : null;

  const StrengthChart = () => {
    if (strengthVols.length === 0) return <EmptyChart text="Dodaj trening siłowy, aby zobaczyć progres" />;
    const max = Math.max(...strengthVols, 1);
    return (
      <div className="h-32 w-full flex items-end justify-between gap-1.5 px-2">
        {strengthVols.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-foreground rounded-t-md transition-all duration-1000" style={{ height: `${Math.max(8, (v / max) * 100)}%` }} />
          </div>
        ))}
      </div>
    );
  };

  const WeightChart = () => {
    const points = weightLog.slice(-7);
    if (points.length === 0) return <EmptyChart text="Zapisz wagę, aby zobaczyć trend" />;
    const weights = points.map((p) => p.weight);
    const max = Math.max(...weights), min = Math.min(...weights), range = max - min || 1;
    return (
      <div className="h-32 w-full flex items-end justify-between gap-3 px-4">
        {points.map((p, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <div className="w-full bg-secondary rounded-t-xl border-x border-t border-foreground/10 transition-all duration-1000" style={{ height: `${40 + ((p.weight - min) / range) * 55}%` }} />
          </div>
        ))}
      </div>
    );
  };

  // Wiersz ustawień (tappable)
  const Row = ({ icon, label, value, onClick }: { icon: ReactNode; label: string; value?: string; onClick?: () => void }) => (
    <button onClick={onClick} className="w-full p-5 bg-card rounded-3xl border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
      <div className="flex items-center gap-4">
        <div className="text-foreground">{icon}</div>
        <span className="font-black uppercase italic text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm font-bold text-muted-foreground">{value}</span>}
        <ChevronRight size={18} className="text-muted-foreground" />
      </div>
    </button>
  );

  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-widest px-2">{children}</h3>
  );

  const activeActivity = ACTIVITY_LEVELS.find((a) => Math.abs(a.level - profile.activityLevel) < 0.001);

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-32 min-h-screen bg-background text-foreground space-y-8">

        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">PROFIL</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">Centrum dowodzenia</p>
        </header>

        {/* AVATAR */}
        <section className="p-8 rounded-[3rem] bg-card border border-foreground/10 flex flex-col items-center gap-4 text-center">
          <div className="w-28 h-28 rounded-[2.25rem] bg-secondary flex items-center justify-center border-2 border-foreground/20 overflow-hidden">
            {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="" /> : <UserCircle size={56} className="text-muted-foreground" />}
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase italic leading-tight">{profile.name}</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Kilo Elite Member</p>
          </div>
        </section>

        {/* SUBSKRYPCJA */}
        <div className="space-y-3">
          <SectionTitle>Subskrypcja</SectionTitle>
          <div className="p-2 bg-card rounded-3xl border border-foreground/10 grid grid-cols-3 gap-1.5">
            {([['free', 'Darmowy'], ['pro', 'KILO PRO'], ['elite', 'KILO ELITE']] as const).map(([id, label]) => (
              <button key={id} onClick={() => updateField('plan', id)} className={`py-3 rounded-2xl font-black uppercase text-[9px] tracking-tight transition-all active:scale-95 ${(profile.plan || 'free') === id ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* PARAMETRY */}
        <div className="space-y-3">
          <SectionTitle>Parametry</SectionTitle>
          <Row icon={<User size={20} />} label="Imię" value={profile.name} onClick={() => startEditing('name', profile.name)} />
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => startEditing('weight', profile.weight)} className="p-5 bg-card rounded-3xl border border-foreground/10 text-left active:scale-[0.98] transition-all">
              <Scale size={18} /><p className="text-[10px] font-black text-muted-foreground uppercase mt-2">Waga</p><p className="text-2xl font-black italic">{profile.weight}kg</p>
            </button>
            <button onClick={() => startEditing('height', profile.height)} className="p-5 bg-card rounded-3xl border border-foreground/10 text-left active:scale-[0.98] transition-all">
              <Ruler size={18} /><p className="text-[10px] font-black text-muted-foreground uppercase mt-2">Wzrost</p><p className="text-2xl font-black italic">{profile.height}cm</p>
            </button>
          </div>
          <Row icon={<Activity size={20} />} label="Wiek" value={`${profile.age} lat`} onClick={() => startEditing('age', profile.age)} />

          {/* Płeć */}
          <div className="p-2 bg-card rounded-3xl border border-foreground/10 flex gap-2">
            {(['male', 'female'] as const).map((g) => (
              <button key={g} onClick={() => updateField('gender', g)} className={`flex-1 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${profile.gender === g ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                {g === 'male' ? 'Mężczyzna' : 'Kobieta'}
              </button>
            ))}
          </div>

          {/* Cel */}
          <div className="p-2 bg-card rounded-3xl border border-foreground/10 flex gap-2">
            {(['cut', 'recomp', 'bulk'] as const).map((g) => (
              <button key={g} onClick={() => updateField('goal', g)} className={`flex-1 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${profile.goal === g ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                {goalLabels[g]}
              </button>
            ))}
          </div>

          {/* Aktywność */}
          <div className="p-2 bg-card rounded-3xl border border-foreground/10 grid grid-cols-5 gap-1">
            {ACTIVITY_LEVELS.map((a) => (
              <button key={a.level} onClick={() => updateField('activityLevel', a.level)} className={`py-3 rounded-xl font-black uppercase text-[8px] tracking-tight transition-all ${activeActivity?.level === a.level ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                {a.label.slice(0, 5)}
              </button>
            ))}
          </div>
        </div>

        {/* WYGLĄD */}
        <div className="space-y-3">
          <SectionTitle>Wygląd</SectionTitle>
          <div className="p-2 bg-card rounded-3xl border border-foreground/10 flex gap-2">
            <button onClick={() => setTheme('dark')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
              <Moon size={16} /> Ciemny
            </button>
            <button onClick={() => setTheme('light')} className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
              <Sun size={16} /> Jasny
            </button>
          </div>
        </div>

        {/* POWIADOMIENIA */}
        <div className="space-y-3">
          <SectionTitle>Powiadomienia</SectionTitle>
          <button onClick={toggleNotifications} className="w-full p-5 bg-card rounded-3xl border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <Bell size={20} />
              <span className="font-black uppercase italic text-sm">Powiadomienia trenera AI</span>
            </div>
            <div className={`w-12 h-7 rounded-full p-1 transition-all ${notifications ? 'bg-foreground' : 'bg-secondary'}`}>
              <div className={`w-5 h-5 rounded-full transition-all ${notifications ? 'bg-background translate-x-5' : 'bg-muted-foreground'}`} />
            </div>
          </button>
        </div>

        {/* UPRAWNIENIA */}
        <div className="space-y-3">
          <SectionTitle>Uprawnienia</SectionTitle>
          <Row icon={<Camera size={20} />} label="Kamera (skaner)" value={permLabel(camPerm)} onClick={requestCamera} />
          <Row icon={<MapPin size={20} />} label="Lokalizacja (cardio)" value={permLabel(locPerm)} onClick={requestLocation} />
        </div>

        {/* ANALIZY */}
        <div className="space-y-3">
          <SectionTitle>Analizy</SectionTitle>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="w-full p-6 bg-card rounded-[2.5rem] border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 bg-secondary rounded-2xl"><Brain size={22} /></div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bio-Intelligence</p>
                    <p className="text-lg font-black italic uppercase leading-none mt-1">Raporty</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-muted-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-card border-t-border text-foreground h-[92vh]">
              <div className="mx-auto w-full max-w-md flex flex-col h-full overflow-hidden">
                <DrawerHeader className="border-b border-foreground/10 pb-4">
                  <DrawerTitle className="text-3xl font-black uppercase italic text-center tracking-tighter">Bio-Intelligence</DrawerTitle>
                  <DrawerDescription className="text-center text-muted-foreground font-bold uppercase text-[9px] tracking-[0.4em]">Twoje realne dane</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 pb-20">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2"><TrendingUp size={18} /><h4 className="text-xs font-black uppercase italic tracking-widest">Postępy Siłowe</h4></div>
                      <span className="text-[10px] font-black bg-foreground/10 px-2 py-1 rounded-md">{strengthDelta !== null ? `${strengthDelta > 0 ? '+' : ''}${strengthDelta}%` : '—'}</span>
                    </div>
                    <div className="p-5 bg-background rounded-[2rem] border border-foreground/10"><StrengthChart /></div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-bold uppercase"><ShieldCheck className="inline mr-1" size={12} /> Objętość treningowa z Twojej historii.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2"><Heart size={18} /><h4 className="text-xs font-black uppercase italic tracking-widest">Tętno Spoczynkowe</h4></div>
                      <span className="text-[10px] font-black text-muted-foreground bg-foreground/5 px-2 py-1 rounded-md">BRAK DANYCH</span>
                    </div>
                    <div className="p-5 bg-background rounded-[2rem] border border-foreground/10"><EmptyChart text="Połącz zegarek, aby śledzić tętno" /></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2"><Scale size={18} /><h4 className="text-xs font-black uppercase italic tracking-widest">Masa Ciała</h4></div>
                      <span className="text-[10px] font-black bg-foreground/10 px-2 py-1 rounded-md">{weightDelta === null ? 'TREND —' : weightDelta <= 0 ? `↓ ${weightDelta}kg` : `↑ +${weightDelta}kg`}</span>
                    </div>
                    <div className="p-5 bg-background rounded-[2rem] border border-foreground/10"><WeightChart /></div>
                  </div>
                </div>
                <DrawerClose asChild>
                  <button className="p-6 text-muted-foreground font-black uppercase text-[10px] tracking-widest">Zamknij</button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* URZĄDZENIA */}
        <div className="space-y-3">
          <SectionTitle>Urządzenia</SectionTitle>
          <Drawer>
            <DrawerTrigger asChild>
              <button className="w-full p-5 bg-card rounded-3xl border border-foreground/10 flex items-center justify-between active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4"><Watch size={20} /><span className="font-black uppercase italic text-sm">Połącz zegarek</span></div>
                <ChevronRight size={18} className="text-muted-foreground" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-card text-foreground">
              <div className="mx-auto w-full max-w-sm pb-10">
                <DrawerHeader><DrawerTitle className="text-2xl font-black uppercase italic text-center">Urządzenia</DrawerTitle></DrawerHeader>
                <div className="p-4 space-y-3">
                  {[{ name: 'Apple Watch', icon: <Smartphone /> }, { name: 'Samsung Health', icon: <Watch /> }, { name: 'Garmin', icon: <Bluetooth /> }].map((d) => (
                    <div key={d.name} className="w-full p-5 bg-background rounded-3xl border border-foreground/10 flex items-center justify-between font-black uppercase italic text-sm opacity-70">
                      <div className="flex items-center gap-4">{d.icon} {d.name}</div>
                      <div className="text-[10px] text-muted-foreground border border-foreground/15 px-3 py-1 rounded-full">Wkrótce</div>
                    </div>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* KONTO */}
        <div className="space-y-3">
          <SectionTitle>Konto</SectionTitle>
          <button onClick={handleLogout} className="w-full p-5 bg-card rounded-3xl border border-foreground/10 flex items-center gap-4 active:scale-[0.98] transition-all">
            <LogOut size={20} className="text-muted-foreground" /><span className="font-black uppercase italic text-sm">Wyloguj się</span>
          </button>
          <button onClick={() => { if (confirm("Na pewno usunąć wszystkie dane? Tej operacji nie można cofnąć.")) Store.clearUserProfile(); }} className="w-full p-5 bg-background rounded-3xl border-2 border-foreground flex items-center gap-4 active:scale-95 transition-all">
            <Trash2 size={20} /><span className="font-black uppercase italic text-sm">Usuń konto i dane</span>
          </button>
        </div>

        {/* O APLIKACJI */}
        <div className="space-y-3">
          <SectionTitle>O aplikacji</SectionTitle>
          <div className="p-5 bg-card rounded-3xl border border-foreground/10 space-y-3">
            <div className="flex justify-between text-[11px] font-bold uppercase"><span className="text-muted-foreground">Wersja</span><span>{APP_VERSION}</span></div>
            <button className="w-full flex justify-between items-center text-[11px] font-bold uppercase pt-2 border-t border-foreground/10"><span>Polityka prywatności</span><ChevronRight size={16} className="text-muted-foreground" /></button>
            <button className="w-full flex justify-between items-center text-[11px] font-bold uppercase pt-2 border-t border-foreground/10"><span>Regulamin</span><ChevronRight size={16} className="text-muted-foreground" /></button>
          </div>
          <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground pt-2">KILO — rozwal system</p>
        </div>

        {/* MODAL EDYCJI */}
        <AnimatePresence>
          {editingField && (
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="fixed inset-0 z-[600] bg-background p-6 flex flex-col text-foreground">
              <header className="flex justify-between items-center mb-12">
                <button onClick={() => setEditingField(null)}><ChevronLeft size={32} /></button>
                <h2 className="font-black uppercase italic tracking-tighter text-xl">Edytuj</h2>
                <button onClick={saveEdit} className="px-5 py-2 bg-foreground text-background rounded-2xl font-black uppercase text-xs flex items-center gap-1"><Check size={14} /> Zapisz</button>
              </header>
              <div className="flex-1 flex flex-col items-center justify-center">
                {editingField === 'name' ? (
                  <input type="text" className="bg-transparent text-5xl font-black italic text-center outline-none border-b-4 border-foreground pb-2 w-full text-foreground" value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
                ) : (
                  <div className="w-full flex flex-col items-center">
                    <input type="number" inputMode="numeric" className="bg-transparent text-8xl font-black italic text-center outline-none border-b-4 border-foreground pb-2 w-full text-foreground tabular-nums" value={tempValue} onChange={(e) => setTempValue(e.target.value)} autoFocus />
                    <p className="text-xl font-black uppercase text-muted-foreground mt-6 italic">
                      {editingField === 'weight' ? 'Kilogramy (kg)' : editingField === 'height' ? 'Centymetry (cm)' : 'Wiek (lat)'}
                    </p>
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
