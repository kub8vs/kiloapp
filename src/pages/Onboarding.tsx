import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Zap, Chrome, Apple as AppleIcon, Dumbbell, Home, Target, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveUserProfile } from '@/lib/user-store';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth';

type Step = 'welcome' | 'auth' | 'basics' | 'activity' | 'training' | 'goal' | 'calculating';

const activityLevels = [
  { level: 1.2, label: 'Minimalna', desc: 'Brak ćwiczeń, praca siedząca' },
  { level: 1.375, label: 'Lekka', desc: '1-2 treningi w tygodniu' },
  { level: 1.55, label: 'Średnia', desc: '3-5 treningów tygodniowo' },
  { level: 1.725, label: 'Wysoka', desc: 'Ciężka praca fizyczna + treningi' },
];

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
  });

  // Logowanie Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setStep('basics');
    } catch (error) {
      console.error("Błąd Google:", error);
    }
  };

  // Logowanie Apple
  const handleAppleLogin = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
      setStep('basics');
    } catch (error) {
      console.error("Błąd Apple:", error);
    }
  };

  const calculateMacros = () => {
    const w = parseFloat(formData.weight) || 70;
    const h = parseFloat(formData.height) || 170;
    const a = parseInt(formData.age) || 25;

    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;

    const tdee = bmr * formData.activityLevel;
    let targetKcal = tdee;
    if (formData.goal === 'cut') targetKcal = tdee - 500;
    if (formData.goal === 'bulk') targetKcal = tdee + 300;

    return {
      kcal: Math.round(targetKcal),
      protein: Math.round(w * 2.2),
      carbs: Math.round((targetKcal * 0.45) / 4),
      fat: Math.round((targetKcal * 0.25) / 9),
    };
  };

  const handleComplete = () => {
    setStep('calculating');
    const macros = calculateMacros();
    const profile = {
      ...formData,
      ...macros,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveUserProfile(profile as any);
      window.location.href = '/dashboard';
    }, 2500);
  };

  const stepsOrder: Step[] = ['welcome', 'auth', 'basics', 'activity', 'training', 'goal'];
  const currentIndex = stepsOrder.indexOf(step);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      {currentIndex > 1 && step !== 'calculating' && (
        <div className="px-6 pt-12">
          <div className="flex gap-1">
            {stepsOrder.slice(2).map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= (currentIndex - 2) ? 'bg-white' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-6 flex flex-col justify-center">
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
                <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center -rotate-6 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                  <Zap size={40} className="text-black fill-black" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">KILO<br/>ELITE</h1>
                  <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">System Inteligentnego Treningu</p>
                </div>
              </div>
            )}

            {step === 'auth' && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black uppercase italic italic tracking-tighter">Dołącz do Elite</h2>
                  <p className="text-zinc-500">Twoje dane będą bezpieczne w chmurze.</p>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleGoogleLogin} className="w-full h-16 bg-white text-black hover:bg-zinc-200 rounded-2xl font-bold flex gap-3">
                    <Chrome size={20} /> Kontynuuj z Google
                  </Button>
                  <Button onClick={handleAppleLogin} className="w-full h-16 bg-zinc-900 text-white hover:bg-zinc-800 rounded-2xl font-bold border border-zinc-800 flex gap-3">
                    <AppleIcon size={20} /> Kontynuuj z Apple
                  </Button>
                  <button onClick={() => setStep('basics')} className="w-full text-zinc-500 text-sm font-bold uppercase tracking-widest pt-4">Pomiń na razie</button>
                </div>
              </div>
            )}

            {step === 'basics' && (
              <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Biometria</h2>
                <div className="space-y-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Twoje imię"
                    className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-xl font-bold focus:border-white transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Wiek" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center font-bold" />
                    <Input type="number" placeholder="Wzrost cm" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center font-bold" />
                  </div>
                  <Input type="number" placeholder="Waga kg" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center font-bold" />
                  <div className="grid grid-cols-2 gap-4">
                    {['male', 'female'].map((g) => (
                      <button key={g} onClick={() => setFormData({ ...formData, gender: g as any })} className={`h-16 rounded-2xl font-black uppercase transition-all ${formData.gender === g ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}>
                        {g === 'male' ? 'Mężczyzna' : 'Kobieta'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'activity' && (
              <div className="space-y-4">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter">Aktywność</h2>
                <div className="grid gap-2">
                  {activityLevels.map((item) => (
                    <button key={item.level} onClick={() => setFormData({ ...formData, activityLevel: item.level })} className={`p-5 rounded-2xl text-left transition-all border-2 ${formData.activityLevel === item.level ? 'border-white bg-white/10' : 'border-zinc-900 bg-zinc-900'}`}>
                      <div className="font-black uppercase italic text-sm">{item.label}</div>
                      <div className="text-[10px] text-zinc-500 uppercase mt-1 tracking-wider">{item.desc}</div>
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
                    <button key={style.id} onClick={() => setFormData({ ...formData, trainingStyle: style.id })} className={`p-6 rounded-3xl flex flex-col items-center gap-4 transition-all border-2 ${formData.trainingStyle === style.id ? 'border-white bg-white text-black' : 'bg-zinc-900 border-zinc-900 text-zinc-400'}`}>
                      {style.icon}
                      <span className="font-black uppercase text-[10px] italic">{style.label}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-[0.2em] ml-2">Poziom zaawansowania</p>
                  {experienceLevels.map((exp) => (
                    <button key={exp.id} onClick={() => setFormData({ ...formData, experience: exp.id })} className={`w-full p-4 rounded-2xl text-left border ${formData.experience === exp.id ? 'border-white bg-white/5' : 'border-zinc-800'}`}>
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
                    <button key={item.id} onClick={() => setFormData({ ...formData, goal: item.id as any })} className={`p-6 rounded-[2.5rem] flex items-center gap-5 border-2 transition-all ${formData.goal === item.id ? 'border-white bg-white/10' : 'border-zinc-900 bg-zinc-900'}`}>
                      <span className="text-3xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-black uppercase italic text-lg leading-none">{item.label}</div>
                        <div className="text-zinc-500 text-[10px] uppercase mt-1 font-bold tracking-tight">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'calculating' && (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-20 h-20 border-t-2 border-white rounded-full mb-10" />
                <h3 className="text-2xl font-black uppercase italic tracking-widest animate-pulse">Optymalizacja...</h3>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step !== 'calculating' && (
        <div className="p-8 flex gap-4">
          {currentIndex > 0 && (
            <button onClick={() => setStep(stepsOrder[currentIndex - 1])} className="h-16 w-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400">
              <ChevronLeft />
            </button>
          )}
          <Button
            onClick={step === 'goal' ? handleComplete : () => setStep(stepsOrder[currentIndex + 1])}
            disabled={step === 'basics' && (!formData.name || !formData.age || !formData.weight || !formData.height)}
            className="flex-1 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black uppercase italic text-lg shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
          >
            {step === 'goal' ? 'Generuj Plan' : 'Dalej'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;