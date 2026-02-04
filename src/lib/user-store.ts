import { db, auth } from './firebase';
import { doc, setDoc, getDoc } from "firebase/firestore";

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
  ROUTINES: 'kilo_routines',
  HISTORY: 'kilo_history'
};

// --- SYNCHRONIZACJA Z CHMURĄ ---
const syncToCloud = async (key: string, data: any) => {
  try {
    const user = auth?.currentUser;
    if (!user) return; 
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { [key]: data }, { merge: true });
  } catch (e) {
    console.warn("Błąd synchronizacji Firebase:", e);
  }
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
  syncToCloud('profile', profile);
};

export const updateExtendedProfile = (updates: Partial<UserProfile>) => {
  const current = getUserProfile();
  if (current) {
    const updated = { ...current, ...updates };
    saveUserProfile(updated);
    if (updates.theme) {
      document.documentElement.classList.toggle('dark', updates.theme === 'dark');
    }
  }
};

export const isOnboardingCompleted = (): boolean => {
  const profile = getUserProfile();
  return !!profile?.onboardingCompleted;
};

export const clearUserProfile = () => {
  localStorage.clear();
  if (auth) auth.signOut();
  window.location.href = '/';
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
  syncToCloud('stats', stats);
};

// --- TRENINGI I HISTORIA (Rozwiązuje błąd Workout.tsx) ---
export const getWorkoutRoutines = () => {
  try {
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveRoutine = (routine: any) => {
  const current = getWorkoutRoutines();
  const exists = current.findIndex((r: any) => r.id === routine.id);
  const updated = exists > -1 
    ? current.map((r: any) => r.id === routine.id ? routine : r) 
    : [...current, routine];
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(updated));
  syncToCloud('routines', updated);
};

export const deleteRoutine = (id: string) => {
  const current = getWorkoutRoutines();
  const updated = current.filter((r: any) => r.id !== id);
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(updated));
  syncToCloud('routines', updated);
};

export const getWorkoutHistory = () => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const addToHistory = (entry: any) => {
  const history = getWorkoutHistory();
  const updated = [entry, ...history];
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  syncToCloud('history', updated);
};

export const deleteHistoryItem = (id: string) => {
  const history = getWorkoutHistory();
  const updated = history.filter((h: any) => h.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  syncToCloud('history', updated);
};

export const clearHistory = () => {
  localStorage.removeItem(KEYS.HISTORY);
  syncToCloud('history', []);
};

// --- DIETA I KOMPATYBILNOŚĆ (Rozwiązuje błąd Dashboard.tsx) ---
export const calculateDailyGoals = (profile: UserProfile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === 'male' ? bmr + 5 : bmr - 161;
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * multipliers[activityLevel - 1];
  let kcal = tdee;
  if (goal === 'cut') kcal = tdee - 500;
  else if (goal === 'bulk') kcal = tdee + 300;
  
  return {
    calories: Math.round(kcal),
    protein: Math.round(weight * 2),
    carbs: Math.round((kcal * 0.5) / 4),
    fat: Math.round((kcal * 0.25) / 9),
    steps: 10000
  };
};

export const addToShoppingList = (title?: string, ingredients?: any[]) => {
  console.log("Funkcja listy zakupów wywołana (uproszczona):", title);
};