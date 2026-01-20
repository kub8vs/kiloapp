import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Footprints, 
  ScanLine, 
  Dumbbell, 
  Bike, 
  ChefHat,
  ChevronRight 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import ProgressRing from '@/components/ui/ProgressRing';
import { 
  getUserProfile, 
  getTodayStats, 
  calculateDailyGoals,
  isOnboardingCompleted 
} from '@/lib/user-store';

const weekDays = ['P', 'W', 'Ś', 'C', 'P', 'S', 'N'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getUserProfile());
  const [stats, setStats] = useState(getTodayStats());
  
  useEffect(() => {
    // 1. Sprawdzenie onboardingu
    if (!isOnboardingCompleted()) {
      navigate('/onboarding');
    }

    // 2. Inicjalizacja Chatbota
    // Ustawienie kluczy w window
    (window as any).aichatbotApiKey = "9197ef95-210d-42cf-875f-356fb4c2c33e";
    (window as any).aichatbotProviderId = "f9e9c5e4-6d1a-4b8c-8d3f-3f9e9c5e46d1";

    // Dynamiczne dodanie skryptu
    const script = document.createElement('script');
    script.src = "https://script.chatlab.com/aichatbot.js";
    script.id = "9197ef95-210d-42cf-875f-356fb4c2c33e";
    script.defer = true;
    document.body.appendChild(script);

    // Opcjonalne: usuwanie skryptu przy odmontowaniu komponentu
    return () => {
      const existingScript = document.getElementById("9197ef95-210d-42cf-875f-356fb4c2c33e");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, [navigate]);

  const goals = profile ? calculateDailyGoals(profile) : null;
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; 

  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return today.toLocaleDateString('pl-PL', options);
  };

  if (!profile || !goals) return null;

  const stepsProgress = (stats.steps / goals.steps) * 100;
  const proteinProgress = (stats.protein / goals.protein) * 100;
  const carbsProgress = (stats.carbs / goals.carbs) * 100;
  const fatProgress = (stats.fat / goals.fat) * 100;

  const quickActions = [
    { icon: ScanLine, label: 'Skanuj', path: '/diet' },
    { icon: Dumbbell, label: 'Trening', path: '/workout' },
    { icon: Bike, label: 'Cardio', path: '/workout?tab=cardio' },
    { icon: ChefHat, label: 'Przepisy', path: '/diet?tab=recipes' },
  ];

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-muted-foreground capitalize">{formatDate()}</p>
          <h1 className="text-3xl font-bold mt-1">Cześć, {profile.name}!</h1>
        </motion.div>

        {/* Week Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between"
        >
          {weekDays.map((day, index) => {
            const isToday = index === adjustedDay;
            const isPast = index < adjustedDay;
            
            return (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isToday
                    ? 'bg-foreground text-background'
                    : isPast
                    ? 'bg-card text-foreground'
                    : 'bg-card/50 text-muted-foreground'
                }`}
              >
                {day}
              </div>
            );
          })}
        </motion.div>

        {/* Steps Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="kilo-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                <Footprints size={28} className="text-foreground" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Dzisiejsze kroki</p>
                <p className="text-3xl font-bold">
                  {stats.steps.toLocaleString()}
                  <span className="text-lg text-muted-foreground font-normal">
                    /{goals.steps.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
            <ProgressRing progress={stepsProgress} size={60} strokeWidth={5}>
              <span className="text-xs font-semibold">{Math.round(stepsProgress)}%</span>
            </ProgressRing>
          </div>
        </motion.div>

        {/* Macros Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="kilo-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Makroskładniki</h3>
            <span className="text-muted-foreground text-sm">
              {stats.calories}/{goals.calories} kcal
            </span>
          </div>
          
          <div className="flex justify-around">
            <div className="flex flex-col items-center">
              <ProgressRing 
                progress={proteinProgress} 
                size={70} 
                strokeWidth={5}
                color="hsl(var(--kilo-protein))"
              >
                <span className="text-xs font-bold">B</span>
              </ProgressRing>
              <p className="mt-2 text-sm">
                <span className="font-semibold">{stats.protein}</span>
                <span className="text-muted-foreground">/{goals.protein}g</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <ProgressRing 
                progress={carbsProgress} 
                size={70} 
                strokeWidth={5}
                color="hsl(var(--kilo-carbs))"
              >
                <span className="text-xs font-bold">W</span>
              </ProgressRing>
              <p className="mt-2 text-sm">
                <span className="font-semibold">{stats.carbs}</span>
                <span className="text-muted-foreground">/{goals.carbs}g</span>
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <ProgressRing 
                progress={fatProgress} 
                size={70} 
                strokeWidth={5}
                color="hsl(var(--kilo-fat))"
              >
                <span className="text-xs font-bold">T</span>
              </ProgressRing>
              <p className="mt-2 text-sm">
                <span className="font-semibold">{stats.fat}</span>
                <span className="text-muted-foreground">/{goals.fat}g</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="font-semibold text-lg mb-4">Szybki dostęp</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <action.icon size={24} />
                </div>
                <span className="text-xs text-muted-foreground">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;