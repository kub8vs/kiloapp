import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Chrome, Apple as AppleIcon, Dumbbell, Home, Check, Lock, Sparkles } from 'lucide-react';
import KiloLogo from '@/components/KiloLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveUserProfile, type UserProfile } from '@/lib/user-store';
import { ACTIVITY_LEVELS } from '@/lib/nutrition';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

type Step = 'welcome' | 'auth' | 'basics' | 'ageBlock' | 'activity' | 'training' | 'goal' | 'plan' | 'calculating';

const MIN_AGE = 18;

const activityLevels = ACTIVITY_LEVELS;

const trainingStyles = [
  { id: 'gym', label: 'Siłownia', desc: 'Dostęp do pełnego sprzętu', icon: <Dumbbell size={20} /> },
  { id: 'home', label: 'Dom / Kalistenika', desc: 'Masa ciała, hantle lub gumy', icon: <Home size={20} /> },
];

const experienceLevels = [
  { id: 'beginner', label: 'Początkujący', desc: 'Mniej niż 6 miesięcy stażu' },
  { id: 'intermediate', label: 'Średnio-zaawansowany', desc: '1-3 lata stażu' },
  { id: 'pro', label: 'Pro', desc: 'Ponad 3 lata regularnych treningów' },
];

const goals = [
  { id: 'cut', label: 'Redukcja', desc: 'Utrata tłuszczu (-500 kcal)', icon: '🔥' },
  { id: 'bulk', label: 'Masa', desc: 'Budowa mięśni (+300 kcal)', icon: '💪' },
  { id: 'recomp', label: 'Rekompozycja', desc: 'Równoczesna budowa i spalanie', icon: '⚖️' },
];

const PLANS = [
  { id: 'free' as const, name: 'Darmowy', monthly: 0, yearly: 0, perks: ['Licznik kalorii i makro', 'Dziennik posiłków', 'Podstawowy trening'] },
  { id: 'pro' as const, name: 'KILO PRO', monthly: 29.99, yearly: 199, popular: true, perks: ['Wszystko z Darmowego', 'Trenerzy AI 24/7', 'Skaner posiłków AI', 'Pełne analizy Bio-Intelligence'] },
  { id: 'elite' as const, name: 'KILO ELITE', monthly: 49.99, yearly: 349, perks: ['Wszystko z PRO', 'Plany generowane przez AI', 'Priorytetowy trener', 'Integracje z zegarkami'] },
];

const fmtPrice = (v: number) => (v === 0 ? '0 zł' : `${v.toFixed(2).replace('.', ',')} zł`);

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female',
    activityLevel: 1.375,
    trainingStyle: 'gym',
    experience: 'beginner',
    goal: 'recomp' as 'cut' | 'bulk' | 'recomp',
    plan: 'pro' as 'free' | 'pro' | 'elite',
    billing: 'yearly' as 'monthly' | 'yearly',
  });

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try { await signInWithPopup(auth, provider); setStep('basics'); }
    catch (error) { console.error('Błąd Google:', error); }
  };

  const handleAppleLogin = async () => {
    const provider = new OAuthProvider('apple.com');
    try { await signInWithPopup(auth, provider); setStep('basics'); }
    catch (error) { console.error('Błąd Apple:', error); }
  };

  const handleComplete = () => {
    setStep('calculating');
    const profile: UserProfile = {
      name: formData.name.trim() || 'Mistrz',
      age: parseInt(formData.age) || 25,
      weight: parseFloat(formData.weight) || 70,
      height: parseFloat(formData.height) || 170,
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      trainingStyle: formData.trainingStyle as UserProfile['trainingStyle'],
      experience: formData.experience as UserProfile['experience'],
      plan: formData.plan,
      billing: formData.billing,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      saveUserProfile(profile);
      window.location.href = '/dashboard';
    }, 2500);
  };

  const stepsOrder: Step[] = ['welcome', 'auth', 'basics', 'activity', 'training', 'goal', 'plan'];
  const currentIndex = stepsOrder.indexOf(step);

  const basicsValid = !!formData.name && !!formData.age && !!formData.weight && !!formData.height;

  const handleNext = () => {
    if (step === 'basics') {
      const age = parseInt(formData.age);
      if (!age || age < MIN_AGE) { setStep('ageBlock'); return; }
      setStep('activity'); return;
    }
    if (step === 'goal') { setStep('plan'); return; }
    if (step === 'plan') { handleComplete(); return; }
    setStep(stepsOrder[currentIndex + 1]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      {currentIndex > 1 && step !== 'calculating' && (
        <div className="px-6 pt-12">
          <div className="flex gap-1">
            {stepsOrder.slice(2).map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= (currentIndex - 2) ? 'bg-foreground' : 'bg-secondary'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-6 flex flex-col justify-center overflow-y-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md mx-auto"
          >
            {step === 'welcome' && (
              <div className="text-center space-y-10">
                <div className="w-20 h-20 bg-foreground rounded-3xl mx-auto flex items-center justify-center -rotate-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <KiloLogo size={40} className="text-background" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">KILO<br />ELITE</h1>
                  <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs">System Inteligentnego Treningu</p>
                </div>
              </div>
            )}

            {step === 'auth' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Dołącz do Elite</h2>
                  <p className="text-muted-foreground">Twoje dane będą bezpieczne w chmurze.</p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleGoogleLogin} className="w-full h-16 bg-foreground text-background hover:opacity-90 active:scale-95 rounded-2xl font-bold flex gap-3 transition-all">
                    <Chrome size={20} /> Kontynuuj z Google
                  </Button>
                  <Button onClick={handleAppleLogin} className="w-full h-16 bg-card text-foreground hover:bg-secondary active:scale-95 rounded-2xl font-bold border border-border flex gap-3 transition-all">
                    <AppleIcon size={20} /> Kontynuuj z Apple
                  </Button>
                  <button onClick={() => setStep('basics')} className="w-full text-muted-foreground text-sm font-bold uppercase tracking-widest pt-4 active:scale-95 transition-all">Pomiń na razie</button>
                </div>
              </div>
            )}

            {step === 'basics' && (
              <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Biometria</h2>
                <div className="space-y-4">
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Twoje imię" className="h-16 bg-card border-border rounded-2xl text-xl font-bold focus:border-foreground transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" inputMode="numeric" placeholder="Wiek" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="h-16 bg-card border-border rounded-2xl text-center font-bold" />
                    <Input type="number" inputMode="numeric" placeholder="Wzrost cm" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="h-16 bg-card border-border rounded-2xl text-center font-bold" />
                  </div>
                  <Input type="number" inputMode="numeric" placeholder="Waga kg" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="h-16 bg-card border-border rounded-2xl text-center font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    {(['male', 'female'] as const).map((g) => (
                      <button key={g} onClick={() => setFormData({ ...formData, gender: g })} className={`h-16 rounded-2xl font-black uppercase transition-all active:scale-95 ${formData.gender === g ? 'bg-foreground text-background' : 'bg-card text-muted-foreground'}`}>
                        {g === 'male' ? 'Mężczyzna' : 'Kobieta'}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold text-center pt-2">KILO jest dostępne wyłącznie dla osób 18+</p>
                </div>
              </div>
            )}

            {step === 'ageBlock' && (
              <div className="text-center space-y-8 py-10">
                <div className="w-20 h-20 rounded-3xl bg-card border border-border mx-auto flex items-center justify-center">
                  <Lock size={36} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Dostęp od 18 lat</h2>
                  <p className="text-muted-foreground font-medium leading-relaxed px-4">
                    KILO zawiera plany treningowe i żywieniowe przeznaczone dla osób pełnoletnich.
                    Wróć, gdy skończysz 18 lat.
                  </p>
                </div>
              </div>
            )}

            {step === 'activity' && (
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Aktywność</h2>
                <div className="grid gap-2">
                  {activityLevels.map((item) => (
                    <button key={item.level} onClick={() => setFormData({ ...formData, activityLevel: item.level })} className={`p-5 rounded-2xl text-left transition-all border-2 active:scale-[0.98] ${formData.activityLevel === item.level ? 'border-foreground bg-foreground/10' : 'border-border bg-card'}`}>
                      <div className="font-black uppercase italic text-sm">{item.label}</div>
                      <div className="text-[10px] text-muted-foreground uppercase mt-1 tracking-wider">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'training' && (
              <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Środowisko</h2>
                <div className="grid grid-cols-2 gap-4">
                  {trainingStyles.map((style) => (
                    <button key={style.id} onClick={() => setFormData({ ...formData, trainingStyle: style.id })} className={`p-6 rounded-3xl flex flex-col items-center gap-4 transition-all border-2 active:scale-95 ${formData.trainingStyle === style.id ? 'border-foreground bg-foreground text-background' : 'bg-card border-border text-muted-foreground'}`}>
                      {style.icon}
                      <span className="font-black uppercase text-[10px] italic">{style.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-2">Poziom zaawansowania</p>
                  {experienceLevels.map((exp) => (
                    <button key={exp.id} onClick={() => setFormData({ ...formData, experience: exp.id })} className={`w-full p-4 rounded-2xl text-left border transition-all active:scale-[0.98] ${formData.experience === exp.id ? 'border-foreground bg-foreground/5' : 'border-border'}`}>
                      <div className="text-xs font-bold uppercase">{exp.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'goal' && (
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Twój Cel</h2>
                <div className="grid gap-3">
                  {goals.map((item) => (
                    <button key={item.id} onClick={() => setFormData({ ...formData, goal: item.id as 'cut' | 'bulk' | 'recomp' })} className={`p-6 rounded-[2.5rem] flex items-center gap-5 border-2 transition-all active:scale-[0.98] ${formData.goal === item.id ? 'border-foreground bg-foreground/10' : 'border-border bg-card'}`}>
                      <span className="text-3xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-black uppercase italic text-lg leading-none">{item.label}</div>
                        <div className="text-muted-foreground text-[10px] uppercase mt-1 font-bold tracking-tight">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'plan' && (
              <div className="space-y-5">
                <div className="text-center space-y-1">
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">Wybierz Plan</h2>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">7 dni PRO za darmo</p>
                </div>

                {/* Billing toggle */}
                <div className="p-1.5 bg-card rounded-2xl border border-border flex gap-1.5">
                  {(['monthly', 'yearly'] as const).map((b) => (
                    <button key={b} onClick={() => setFormData({ ...formData, billing: b })} className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 ${formData.billing === b ? 'bg-foreground text-background' : 'text-muted-foreground'}`}>
                      {b === 'monthly' ? 'Miesięcznie' : 'Rocznie · −30%'}
                    </button>
                  ))}
                </div>

                {/* Plan cards */}
                <div className="space-y-3">
                  {PLANS.map((p) => {
                    const sel = formData.plan === p.id;
                    const price = formData.billing === 'yearly' ? p.yearly : p.monthly;
                    const suffix = p.id === 'free' ? '' : formData.billing === 'yearly' ? '/rok' : '/mc';
                    return (
                      <button key={p.id} onClick={() => setFormData({ ...formData, plan: p.id })} className={`w-full p-5 rounded-[2rem] text-left border-2 transition-all active:scale-[0.98] relative ${sel ? 'border-foreground bg-foreground/10' : 'border-border bg-card'}`}>
                        {p.popular && (
                          <span className="absolute -top-2.5 right-5 bg-foreground text-background text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={10} /> Najpopularniejszy
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-black uppercase italic text-lg leading-none">{p.name}</p>
                            <p className="text-2xl font-black italic mt-1">{fmtPrice(price)}<span className="text-[10px] text-muted-foreground ml-1">{suffix}</span></p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? 'bg-foreground border-foreground' : 'border-border'}`}>
                            {sel && <Check size={14} className="text-background" />}
                          </div>
                        </div>
                        <ul className="space-y-1.5">
                          {p.perks.map((perk) => (
                            <li key={perk} className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                              <Check size={12} className="text-foreground shrink-0" /> {perk}
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[9px] text-muted-foreground text-center uppercase tracking-wider font-bold">
                  Anulujesz kiedy chcesz. Płatność uruchomimy po publikacji w sklepie.
                </p>
              </div>
            )}

            {step === 'calculating' && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-20 h-20 border-t-2 border-foreground rounded-full mb-10" />
                <h3 className="text-2xl font-black uppercase italic tracking-widest animate-pulse">Optymalizacja...</h3>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AGE BLOCK — własny przycisk */}
      {step === 'ageBlock' && (
        <div className="p-8">
          <Button onClick={() => setStep('basics')} className="w-full h-16 rounded-2xl bg-foreground text-background hover:opacity-90 active:scale-95 font-black uppercase italic text-lg transition-all">
            Zmień wiek
          </Button>
        </div>
      )}

      {/* NAWIGACJA */}
      {step !== 'calculating' && step !== 'ageBlock' && (
        <div className="p-8 flex gap-4">
          {currentIndex > 0 && (
            <button onClick={() => setStep(stepsOrder[currentIndex - 1])} className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground active:scale-95 transition-all">
              <ChevronLeft />
            </button>
          )}
          <Button
            onClick={handleNext}
            disabled={step === 'basics' && !basicsValid}
            className="flex-1 h-16 rounded-2xl bg-foreground text-background hover:opacity-90 active:scale-95 font-black uppercase italic text-lg transition-all disabled:opacity-40 disabled:active:scale-100 shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            {step === 'plan' ? 'Rozpocznij' : 'Dalej'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
