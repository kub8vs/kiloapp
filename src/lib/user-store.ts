// --- INTERFEJSY ---
export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 1 | 2 | 3 | 4 | 5;
  goal: 'cut' | 'bulk' | 'recomp';
  onboardingCompleted: boolean;
  createdAt: string;
  avatar?: string;
  theme?: 'light' | 'dark';
}

export interface DailyStats {
  date: string;
  steps: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workoutCompleted: boolean;
}

const KEYS = {
  PROFILE: 'kilo_user_profile',
  STATS: 'kilo_daily_stats',
  SHOPPING: 'kilo_shopping_list'
};

// --- PROFIL ---
export const getUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (e) { return null; }
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const clearUserProfile = () => {
  localStorage.clear();
  window.location.reload();
};

export const isOnboardingCompleted = (): boolean => {
  const profile = getUserProfile();
  return !!profile?.onboardingCompleted;
};

// --- STATYSTYKI DZIENNE ---
export const getTodayStats = (): DailyStats => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const data = localStorage.getItem(KEYS.STATS);
    if (data) {
      const stats = JSON.parse(data);
      if (stats.date === today) return stats;
    }
  } catch (e) {}
  return { date: today, steps: 0, calories: 0, protein: 0, carbs: 0, fat: 0, workoutCompleted: false };
};

export const saveDailyStats = (stats: DailyStats): void => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

// --- LISTA ZAKUPÓW ---
export const getShoppingList = () => {
  try {
    const data = localStorage.getItem(KEYS.SHOPPING);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const addToShoppingList = (name: string, ingredients: string[]) => {
  const current = getShoppingList();
  const newItem = { id: Date.now().toString(), name, ingredients };
  localStorage.setItem(KEYS.SHOPPING, JSON.stringify([...current, newItem]));
};

export const removeFromShoppingList = (id: string) => {
  const current = getShoppingList();
  localStorage.setItem(KEYS.SHOPPING, JSON.stringify(current.filter((i: any) => i.id !== id)));
};

// --- KALKULATOR CELÓW ---
export const calculateDailyGoals = (profile: UserProfile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * multipliers[activityLevel - 1];
  let kcal = goal === 'cut' ? tdee - 500 : goal === 'bulk' ? tdee + 300 : tdee;
  return {
    calories: Math.round(kcal),
    protein: Math.round(weight * 2),
    carbs: Math.round((kcal * 0.5) / 4),
    fat: Math.round((kcal * 0.25) / 9),
    steps: 10000
  };
};

export const updateExtendedProfile = (updates: any) => {
  const current = getUserProfile();
  if (current) saveUserProfile({ ...current, ...updates });
};

export const addToHistory = (entry: any): void => {
  const history = getWorkoutHistory();
  localStorage.setItem('kilo_history', JSON.stringify([entry, ...history]));
};    