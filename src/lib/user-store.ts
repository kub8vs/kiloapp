import { db, auth } from './firebase';
import { doc, setDoc, getDoc, type DocumentData } from "firebase/firestore";
import { calculateTargets } from './nutrition';
import type { HistoryEntry, Routine } from './types';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  /** Mnożnik TDEE (1.2–1.9), nie indeks. Patrz lib/nutrition.ts */
  activityLevel: number;
  goal: 'cut' | 'bulk' | 'recomp';
  trainingStyle?: 'gym' | 'home';
  experience?: 'beginner' | 'intermediate' | 'pro';
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

export interface MealItem {
  id: number;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  weight: number;
}

export interface Meal {
  name: string;
  items: MealItem[];
}

export interface DailyLog {
  date: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal;
  };
  water: number;
}

const KEYS = {
  PROFILE: 'kilo_user_profile',
  STATS: 'kilo_daily_stats',
  ROUTINES: 'kilo_routines',
  HISTORY: 'kilo_history',
  LOG: 'kilo_daily_log',
  SHOPPING: 'kilo_shopping_list',
  STEPS: 'kilo_steps',
  WEIGHT: 'kilo_weight_log',
};

const todayKey = () => new Date().toISOString().split('T')[0];

// --- SYNCHRONIZACJA Z CHMURĄ ---
const syncToCloud = async (key: string, data: unknown) => {
  try {
    const user = auth?.currentUser;
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { [key]: data } as DocumentData, { merge: true });
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

// --- DZIENNY LOG (posiłki + woda) — wspólne źródło dla Diet i Dashboard ---
const emptyLog = (): DailyLog => ({
  date: todayKey(),
  meals: {
    breakfast: { name: 'Śniadanie', items: [] },
    lunch: { name: 'Obiad', items: [] },
    dinner: { name: 'Kolacja', items: [] },
    snacks: { name: 'Przekąski', items: [] },
  },
  water: 0,
});

export const getDailyLog = (): DailyLog => {
  try {
    const data = localStorage.getItem(KEYS.LOG);
    if (data) {
      const log = JSON.parse(data) as DailyLog;
      if (log.date === todayKey()) return log;
    }
  } catch (e) {
    /* brak lub uszkodzony zapis — użyj pustego logu */
  }
  return emptyLog();
};

export const saveDailyLog = (log: DailyLog): void => {
  localStorage.setItem(KEYS.LOG, JSON.stringify(log));
  syncToCloud('dailyLog', log);
};

// --- KROKI (na razie ręczne/0; docelowo HealthKit / Google Fit) ---
export const getSteps = (): number => {
  try {
    const data = localStorage.getItem(KEYS.STEPS);
    if (data) {
      const s = JSON.parse(data);
      if (s.date === todayKey()) return s.steps || 0;
    }
  } catch (e) {
    /* brak lub uszkodzony zapis — domyślnie 0 */
  }
  return 0;
};

export const saveSteps = (steps: number): void => {
  localStorage.setItem(KEYS.STEPS, JSON.stringify({ date: todayKey(), steps }));
};

// --- LOG MASY CIAŁA (realny wykres trendu) ---
export interface WeightEntry {
  date: string;
  weight: number;
}

export const getWeightLog = (): WeightEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.WEIGHT) || '[]');
  } catch (e) {
    return [];
  }
};

export const addWeightEntry = (weight: number): WeightEntry[] => {
  const value = Number(weight);
  if (!value || Number.isNaN(value)) return getWeightLog();
  const date = todayKey();
  const updated = [...getWeightLog().filter((e) => e.date !== date), { date, weight: value }]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30); // ostatnie 30 wpisów
  localStorage.setItem(KEYS.WEIGHT, JSON.stringify(updated));
  syncToCloud('weightLog', updated);
  return updated;
};

// --- STATYSTYKI DNIA (liczone z logu, więc zawsze spójne z Dietą) ---
export const getTodayStats = (): DailyStats => {
  const log = getDailyLog();
  let calories = 0, protein = 0, carbs = 0, fat = 0;
  Object.values(log.meals).forEach((m) =>
    m.items.forEach((i) => {
      calories += i.kcal || 0;
      protein += i.p || 0;
      carbs += i.c || 0;
      fat += i.f || 0;
    }),
  );
  return {
    date: log.date,
    steps: getSteps(),
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    workoutCompleted: false,
  };
};

// --- TRENINGI I HISTORIA (Rozwiązuje błąd Workout.tsx) ---
export const getWorkoutRoutines = (): Routine[] => {
  try {
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

export const saveRoutine = (routine: Routine) => {
  const current = getWorkoutRoutines();
  const exists = current.findIndex((r) => r.id === routine.id);
  const updated = exists > -1
    ? current.map((r) => r.id === routine.id ? routine : r)
    : [...current, routine];
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(updated));
  syncToCloud('routines', updated);
};

export const deleteRoutine = (id: string) => {
  const current = getWorkoutRoutines();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(updated));
  syncToCloud('routines', updated);
};

export const getWorkoutHistory = (): HistoryEntry[] => {
  try {
    const data = localStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (e) { return []; }
};

// Suma kalorii spalonych dziś (z historii treningów) — do bilansu energii.
export const getTodayBurned = (): number => {
  const today = new Date().toLocaleDateString();
  return getWorkoutHistory()
    .filter((h) => h.date === today)
    .reduce((sum, h) => sum + (h.kcal || 0), 0);
};

export const addToHistory = (entry: HistoryEntry) => {
  const history = getWorkoutHistory();
  const updated = [entry, ...history];
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  syncToCloud('history', updated);
};

export const deleteHistoryItem = (id: string) => {
  const history = getWorkoutHistory();
  const updated = history.filter((h) => h.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  syncToCloud('history', updated);
};

export const clearHistory = () => {
  localStorage.removeItem(KEYS.HISTORY);
  syncToCloud('history', []);
};

// --- CELE DZIENNE (deleguje do jednego silnika odżywiania: lib/nutrition.ts) ---
export const calculateDailyGoals = (profile: UserProfile) => calculateTargets(profile);

// --- LISTA ZAKUPÓW (trwała) ---
export const getShoppingList = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEYS.SHOPPING) || '[]');
  } catch (e) {
    return [];
  }
};

export const saveShoppingList = (items: string[]): void => {
  localStorage.setItem(KEYS.SHOPPING, JSON.stringify(items));
  syncToCloud('shopping', items);
};

export const addToShoppingList = (ingredients: string[]): string[] => {
  const updated = [...new Set([...getShoppingList(), ...ingredients])];
  saveShoppingList(updated);
  return updated;
};