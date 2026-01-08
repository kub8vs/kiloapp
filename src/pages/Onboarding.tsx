import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, User, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveUserProfile, UserProfile } from '@/lib/user-store';

type Step = 'welcome' | 'basics' | 'activity' | 'goal';

const activityLevels = [
  { level: 1, label: 'Siedzący', desc: 'Mało lub brak ćwiczeń' },
  { level: 2, label: 'Lekko aktywny', desc: '1-3 dni/tydzień' },
  { level: 3, label: 'Umiarkowanie', desc: '3-5 dni/tydzień' },
  { level: 4, label: 'Bardzo aktywny', desc: '6-7 dni/tydzień' },
  { level: 5, label: 'Ekstremalnie', desc: '2x dziennie' },
];

const goals = [
  { id: 'cut', label: 'Redukcja', desc: 'Schudnij i zachowaj mięśnie', icon: '🔥' },
  { id: 'bulk', label: 'Masa', desc: 'Zbuduj mięśnie i siłę', icon: '💪' },
  { id: 'recomp', label: 'Rekompozycja', desc: 'Zamień tłuszcz na mięśnie', icon: '⚖️' },
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
    activityLevel: 3 as 1 | 2 | 3 | 4 | 5,
    goal: 'recomp' as 'cut' | 'bulk' | 'recomp',
  });

  const steps: Step[] = ['welcome', 'basics', 'activity', 'goal'];
  const currentIndex = steps.indexOf(step);

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      name: formData.name,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      goal: formData.goal,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    saveUserProfile(profile);
    navigate('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 'welcome':
        return true;
      case 'basics':
        return formData.name && formData.age && formData.weight && formData.height;
      case 'activity':
        return true;
      case 'goal':
        return true;
      default:
        return false;
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="p-4 pt-12">
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentIndex ? 'bg-foreground' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full"
          >
            {step === 'welcome' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="w-32 h-32 rounded-full bg-card flex items-center justify-center mb-8"
                >
                  <span className="text-6xl font-bold">K</span>
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">KILO</h1>
                <p className="text-muted-foreground text-lg max-w-xs">
                  Twój osobisty asystent fitness z AI. Śledź postępy, trenuj mądrzej.
                </p>
              </div>
            )}

            {step === 'basics' && (
              <div className="py-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">O Tobie</h2>
                    <p className="text-muted-foreground">Podstawowe informacje</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Imię</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Twoje imię"
                      className="h-14 bg-card border-0 rounded-2xl text-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Wiek</label>
                      <Input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        placeholder="lat"
                        className="h-14 bg-card border-0 rounded-2xl text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Wzrost (cm)</label>
                      <Input
                        type="number"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="cm"
                        className="h-14 bg-card border-0 rounded-2xl text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Waga (kg)</label>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="kg"
                      className="h-14 bg-card border-0 rounded-2xl text-lg"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Płeć</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['male', 'female'] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setFormData({ ...formData, gender: g })}
                          className={`h-14 rounded-2xl font-medium transition-colors ${
                            formData.gender === g
                              ? 'bg-foreground text-background'
                              : 'bg-card text-foreground'
                          }`}
                        >
                          {g === 'male' ? 'Mężczyzna' : 'Kobieta'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'activity' && (
              <div className="py-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Aktywność</h2>
                    <p className="text-muted-foreground">Twój poziom aktywności</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {activityLevels.map((item) => (
                    <button
                      key={item.level}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          activityLevel: item.level as 1 | 2 | 3 | 4 | 5,
                        })
                      }
                      className={`w-full p-4 rounded-2xl text-left transition-all ${
                        formData.activityLevel === item.level
                          ? 'bg-foreground text-background'
                          : 'bg-card'
                      }`}
                    >
                      <div className="font-semibold">{item.label}</div>
                      <div
                        className={`text-sm ${
                          formData.activityLevel === item.level
                            ? 'text-background/70'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'goal' && (
              <div className="py-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-card flex items-center justify-center">
                    <Target size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Twój cel</h2>
                    <p className="text-muted-foreground">Co chcesz osiągnąć?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {goals.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          goal: item.id as 'cut' | 'bulk' | 'recomp',
                        })
                      }
                      className={`w-full p-6 rounded-3xl text-left transition-all ${
                        formData.goal === item.id
                          ? 'bg-foreground text-background'
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{item.icon}</span>
                        <div>
                          <div className="font-bold text-lg">{item.label}</div>
                          <div
                            className={`text-sm ${
                              formData.goal === item.id
                                ? 'text-background/70'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pb-10 flex gap-4">
        {currentIndex > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="h-14 px-6 rounded-2xl border-border"
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        <Button
          size="lg"
          onClick={step === 'goal' ? handleComplete : handleNext}
          disabled={!canProceed()}
          className="flex-1 h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-semibold text-lg"
        >
          {step === 'goal' ? 'Rozpocznij' : 'Dalej'}
          {step !== 'goal' && <ChevronRight size={20} className="ml-2" />}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
