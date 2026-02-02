// src/lib/user-store.ts

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
  SHOPPING: 'kilo_shopping_list',
  ROUTINES: 'kilo_routines',
  HISTORY: 'kilo_history'
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
  window.location.href = '/';
};

export const isOnboardingCompleted = (): boolean => {
  const profile = getUserProfile();
  return !!profile?.onboardingCompleted;
};

// --- STATYSTYKI ---
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

// --- TRENINGI (Dla Workout.tsx) ---
export const getWorkoutRoutines = () => {
  try {
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveRoutine = (routine: any) => {
  const current = getWorkoutRoutines();
  const exists = current.findIndex((r: any) => r.id === routine.id);
  
  let updated;
  if (exists > -1) {
    updated = [...current];
    updated[exists] = routine;
  } else {
    updated = [...current, routine];
  }
  
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(updated));
};

export const deleteRoutine = (id: string) => {
  const current = getWorkoutRoutines();
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(current.filter((r: any) => r.id !== id)));
};

export const getWorkoutHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const addToHistory = (entry: any) => {
  const history = getWorkoutHistory();
  // Dodajemy na początek listy, aby najnowsze były u góry
  localStorage.setItem(KEYS.HISTORY, JSON.stringify([entry, ...history]));
};

export const deleteHistoryItem = (id: string) => {
  const history = getWorkoutHistory();
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history.filter((h: any) => h.id !== id)));
};

export const clearHistory = () => localStorage.removeItem(KEYS.HISTORY);

// --- DIETA (Dla Diet.tsx i Dashboard.tsx) ---
export const addToShoppingList = (name: string, ingredients: string[]) => {
  try {
    const data = localStorage.getItem(KEYS.SHOPPING);
    const list = data ? JSON.parse(data) : [];
    list.push({ id: Date.now().toString(), name, ingredients });
    localStorage.setItem(KEYS.SHOPPING, JSON.stringify(list));
  } catch (e) {}
};

// --- KALKULATOR CELÓW ---
export const calculateDailyGoals = (profile: UserProfile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  
  // BMR (Mifflin-St Jeor)
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  
  // Mnożniki aktywności
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * multipliers[activityLevel - 1];
  
  // Definiowanie kalorii na podstawie celu
  let kcal = tdee;
  if (goal === 'cut') kcal = tdee - 500;
  else if (goal === 'bulk') kcal = tdee + 300;
  
  return {
    calories: Math.round(kcal),
    protein: Math.round(weight * 2), // Standard: 2g na kg
    carbs: Math.round((kcal * 0.5) / 4), // 50% kcal z węgli
    fat: Math.round((kcal * 0.25) / 9), // 25% kcal z tłuszczy
    steps: 10000
  };
};

export const updateExtendedProfile = (updates: any) => {
  const current = getUserProfile();
  if (current) {
    const updated = { ...current, ...updates };
    saveUserProfile(updated);
    
    // Jeśli aktualizujemy motyw, zaaplikuj go do dokumentu
    if (updates.theme) {
      document.documentElement.classList.toggle('dark', updates.theme === 'dark');
    }
  }
};