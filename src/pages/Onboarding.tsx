import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Upewnij się, że ta ścieżka jest poprawna
import { saveUserProfile } from '@/lib/user-store';

type Step = 'welcome' | 'basics' | 'activity' | 'goal' | 'calculating';

const activityLevels = [
  { level: 1.2, label: 'Siedzący', desc: 'Praca biurowa, brak ćwiczeń' },
  { level: 1.375, label: 'Lekki', desc: 'Ćwiczenia 1-3 dni/tydzień' },
  { level: 1.55, label: 'Średni', desc: 'Ćwiczenia 3-5 dni/tydzień' },
  { level: 1.725, label: 'Wysoki', desc: 'Ciężkie treningi 6-7 dni' },
  { level: 1.9, label: 'Elite', desc: 'Praca fizyczna + ciężkie treningi' },
];

const goals = [
  { id: 'cut', label: 'Redukcja', desc: 'Utrata tłuszczu, ochrona mięśni (-15% kcal)', icon: '🔥' },
  { id: 'bulk', label: 'Masa', desc: 'Maksymalna budowa siły (+10% kcal)', icon: '💪' },
  { id: 'recomp', label: 'Rekompozycja', desc: 'Budowa mięśni przy utracie fatu', icon: '⚖️' },
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
    goal: 'recomp' as 'cut' | 'bulk' | 'recomp',
  });

  const calculateMacros = () => {
    const w = parseFloat(formData.weight) || 70;
    const h = parseFloat(formData.height) || 170;
    const a = parseInt(formData.age) || 25;

    // BMR (Mifflin-St Jeor)
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;

    const tdee = bmr * formData.activityLevel;

    let targetKcal = tdee;
    if (formData.goal === 'cut') targetKcal = tdee * 0.85;
    if (formData.goal === 'bulk') targetKcal = tdee * 1.10;

    const protein = w * 2.2; 
    const fat = (targetKcal * 0.25) / 9; 
    const carbs = (targetKcal - (protein * 4) - (fat * 9)) / 4;

    return {
      kcal: Math.round(targetKcal),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      tdee: Math.round(tdee)
    };
  };

  const handleComplete = () => {
    setStep('calculating');
    const macros = calculateMacros();

    // Tworzymy finalny profil z domyślnymi ustawieniami motywu i powiadomień
    const profile = {
      ...formData,
      ...macros,
      age: parseInt(formData.age) || 25,
      weight: parseFloat(formData.weight) || 70,
      height: parseFloat(formData.height) || 170,
      theme: 'dark', // Domyślny motyw
      notifications: {
        meals: true,
        water: true,
        reminders: true
      },
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      // @ts-ignore - rzutowanie jeśli interfejs w store jest sztywny
      saveUserProfile(profile);
      // Używamy window.location aby wymusić pełne przeładowanie i odświeżenie danych w Store
      window.location.href = '/dashboard';
    }, 2500);
  };

  const stepsOrder: Step[] = ['welcome', 'basics', 'activity', 'goal'];
  const currentIndex = stepsOrder.indexOf(step);

  const canProceed = () => {
    if (step === 'welcome') return true;
    if (step === 'basics') return formData.name && formData.age && formData.weight && formData.height;
    return true;
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Progress Bar */}
      {step !== 'calculating' && (
        <div className="p-4 pt-12">
          <div className="flex gap-2">
            {stepsOrder.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentIndex ? 'bg-blue-600' : 'bg-zinc-800'}`} />
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 px-6 flex flex-col justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md mx-auto"
          >
            {step === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="w-24 h-24 bg-blue-600 rounded-[2rem] mx-auto flex items-center justify-center rotate-12 shadow-2xl shadow-blue-600/20">
                  <Zap size={48} className="text-white fill-white" />
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase">KILO ELITE</h1>
                <p className="text-zinc-500 text-lg">Twoja transformacja zaczyna się tutaj.</p>
              </div>
            )}

            {step === 'basics' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-black italic uppercase">Biometria</h2>
                <div className="space-y-4">
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Twoje imię"
                    className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-xl font-bold"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Wiek"
                      className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center"
                    />
                    <Input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="Wzrost"
                      className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center"
                    />
                  </div>
                  <Input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="Waga (kg)"
                    className="h-16 bg-zinc-900 border-zinc-800 rounded-2xl text-center"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setFormData({ ...formData, gender: g as any })}
                        className={`h-16 rounded-2xl font-black uppercase transition-all ${formData.gender === g ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500'}`}
                      >
                        {g === 'male' ? 'Mężczyzna' : 'Kobieta'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'activity' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-black italic uppercase">Aktywność</h2>
                <div className="grid gap-2">
                  {activityLevels.map((item) => (
                    <button
                      key={item.level}
                      onClick={() => setFormData({ ...formData, activityLevel: item.level })}
                      className={`p-4 rounded-2xl text-left border-2 transition-all ${formData.activityLevel === item.level ? 'border-blue-600 bg-blue-600/5' : 'border-zinc-900 bg-zinc-900'}`}
                    >
                      <div className="font-black italic uppercase text-sm">{item.label}</div>
                      <div className="text-[10px] text-zinc-500">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'goal' && (
              <div className="space-y-4">
                <h2 className="text-3xl font-black italic uppercase">Cel</h2>
                <div className="grid gap-3">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFormData({ ...formData, goal: item.id as any })}
                      className={`p-5 rounded-[2rem] flex items-center gap-4 border-2 transition-all ${formData.goal === item.id ? 'border-blue-600 bg-blue-600/5' : 'border-zinc-900 bg-zinc-900'}`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="text-left">
                        <div className="font-black italic uppercase text-lg leading-none">{item.label}</div>
                        <div className="text-zinc-500 text-xs mt-1">{item.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'calculating' && (
              <div className="flex flex-col items-center justify-center space-y-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                />
                <h3 className="text-xl font-black italic uppercase animate-pulse">Generowanie Planu...</h3>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {step !== 'calculating' && (
        <div className="p-6 flex gap-4">
          {currentIndex > 0 && (
            <Button onClick={() => setStep(stepsOrder[currentIndex - 1])} variant="ghost" className="h-16 w-16 rounded-2xl bg-zinc-900">
              <ChevronLeft />
            </Button>
          )}
          <Button
            onClick={step === 'goal' ? handleComplete : () => setStep(stepsOrder[currentIndex + 1])}
            disabled={!canProceed()}
            className="flex-1 h-16 rounded-2xl bg-blue-600 text-white font-black italic uppercase text-lg"
          >
            {step === 'goal' ? 'Gotowe' : 'Dalej'}
            <ChevronRight size={24} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Onboarding;