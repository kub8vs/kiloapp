import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ChevronRight, 
  LogOut, 
  Bell, 
  Moon,
  Target,
  Activity,
  Scale,
  TrendingUp
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { getUserProfile, calculateDailyGoals, clearUserProfile } from '@/lib/user-store';

const Profile = () => {
  const navigate = useNavigate();
  const profile = getUserProfile();
  const goals = profile ? calculateDailyGoals(profile) : null;
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  if (!profile || !goals) return null;

  const handleLogout = () => {
    clearUserProfile();
    navigate('/onboarding');
  };

  const goalLabels = {
    cut: 'Redukcja',
    bulk: 'Masa',
    recomp: 'Rekompozycja',
  };

  const activityLabels = [
    'Siedzący',
    'Lekko aktywny',
    'Umiarkowanie',
    'Bardzo aktywny',
    'Ekstremalnie',
  ];

  const menuItems = [
    { icon: Target, label: 'Cele', value: goalLabels[profile.goal] },
    { icon: Activity, label: 'Aktywność', value: activityLabels[profile.activityLevel - 1] },
    { icon: Scale, label: 'Waga', value: `${profile.weight} kg` },
    { icon: TrendingUp, label: 'Postępy', value: 'Zobacz' },
  ];

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl font-bold">Profil</h1>
          <button className="w-10 h-10 rounded-xl bg-card flex items-center justify-center">
            <Settings size={20} />
          </button>
        </motion.div>

        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="kilo-card mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center overflow-hidden">
                {/* Stylized avatar silhouette */}
                <svg
                  viewBox="0 0 100 120"
                  className="w-20 h-20 text-foreground/80"
                  fill="currentColor"
                >
                  {profile.gender === 'male' ? (
                    // Male silhouette
                    <>
                      <ellipse cx="50" cy="25" rx="18" ry="20" />
                      <path d="M20,120 L20,65 Q20,45 35,45 L65,45 Q80,45 80,65 L80,120 Z" />
                      <rect x="18" y="50" width="16" height="40" rx="8" />
                      <rect x="66" y="50" width="16" height="40" rx="8" />
                    </>
                  ) : (
                    // Female silhouette
                    <>
                      <ellipse cx="50" cy="22" rx="16" ry="18" />
                      <path d="M25,120 L30,55 Q35,45 50,45 Q65,45 70,55 L75,120 Q50,110 25,120 Z" />
                      <ellipse cx="28" cy="60" rx="8" ry="20" />
                      <ellipse cx="72" cy="60" rx="8" ry="20" />
                    </>
                  )}
                </svg>
              </div>
              {/* Progress indicator */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                {Math.round((profile.weight / (profile.weight + 5)) * 100)}%
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">
                {profile.age} lat • {profile.height} cm
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs px-3 py-1 rounded-full bg-foreground/10">
                  {goalLabels[profile.goal]}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="kilo-card mb-6"
        >
          <h3 className="font-semibold mb-4">Dzienne cele</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-foreground/5 rounded-2xl p-4">
              <p className="text-muted-foreground text-sm">Kalorie</p>
              <p className="text-2xl font-bold">{goals.calories}</p>
            </div>
            <div className="bg-foreground/5 rounded-2xl p-4">
              <p className="text-muted-foreground text-sm">Białko</p>
              <p className="text-2xl font-bold">{goals.protein}g</p>
            </div>
            <div className="bg-foreground/5 rounded-2xl p-4">
              <p className="text-muted-foreground text-sm">Węglowodany</p>
              <p className="text-2xl font-bold">{goals.carbs}g</p>
            </div>
            <div className="bg-foreground/5 rounded-2xl p-4">
              <p className="text-muted-foreground text-sm">Tłuszcze</p>
              <p className="text-2xl font-bold">{goals.fat}g</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              className="w-full kilo-card flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                  <item.icon size={20} />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{item.value}</span>
                <ChevronRight size={18} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3 mb-6"
        >
          <div className="kilo-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="font-medium">Powiadomienia</span>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="kilo-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                <Moon size={20} />
              </div>
              <span className="font-medium">Tryb ciemny</span>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full h-14 rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <LogOut size={20} className="mr-2" />
            Wyloguj się
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
