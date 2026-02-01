// --- INTERFEJSY PODSTAWOWE ---
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

// --- INTERFEJSY TRENINGOWE (HEAVY STYLE) ---
export interface ExerciseSet {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscle?: string;
  video?: string;
  sets: ExerciseSet[];
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

// --- INTERFEJSY HISTORII I ZAKUPÓW ---
export interface HistoryEntry {
  id: string;
  type: 'strength' | 'cardio';
  name: string;
  date: string;
  duration: string;
  details: string; // np. "12 serii ukończonych" lub "5.2 km, 12.5 km/h"
  kcal: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

// --- KLUCZE LOCAL STORAGE ---
const KEYS = {
  PROFILE: 'kilo_user_profile',
  STATS: 'kilo_daily_stats',
  ROUTINES: 'kilo_routines',
  HISTORY: 'kilo_history',
  SHOPPING: 'kilo_shopping_list'
};

// --- LOGIKA PROFILU ---
export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const isOnboardingCompleted = (): boolean => {
  const profile = getUserProfile();
  return profile?.onboardingCompleted ?? false;
};

export const clearUserProfile = (): void => {
  localStorage.clear(); // Czyści wszystko na urządzeniu dla nowego startu
};

// --- LOGIKA STATYSTYK DZIENNYCH ---
export const getTodayStats = (): DailyStats => {
  const today = new Date().toISOString().split('T')[0];
  const data = localStorage.getItem(KEYS.STATS);
  
  if (data) {
    try {
      const stats = JSON.parse(data);
      if (stats.date === today) return stats;
    } catch { /* ignoruj błąd parsowania */ }
  }
  
  return {
    date: today,
    steps: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    workoutCompleted: false,
  };
};

export const saveDailyStats = (stats: DailyStats): void => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
};

// --- LOGIKA PLANÓW TRENINGOWYCH (ROUTINES) ---
export const getWorkoutRoutines = (): WorkoutRoutine[] => {
  const data = localStorage.getItem(KEYS.ROUTINES);
  if (!data) {
    // Przykładowy plan startowy dla nowych użytkowników
    return [
      { 
        id: '1', 
        name: 'FBW - TRENING A', 
        exercises: [
          { 
            id: 'e1', 
            name: 'Wyciskanie Sztangi', 
            muscle: 'Klatka', 
            sets: [{ weight: '60', reps: '10', completed: false }] 
          }
        ] 
      }
    ];
  }
  return JSON.parse(data);
};

export const saveRoutine = (routine: WorkoutRoutine): void => {
  const routines = getWorkoutRoutines();
  const index = routines.findIndex(r => r.id === routine.id);
  if (index > -1) {
    routines[index] = routine;
  } else {
    routines.push(routine);
  }
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
};

export const deleteRoutine = (id: string): void => {
  const routines = getWorkoutRoutines().filter(r => r.id !== id);
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
};

// --- LOGIKA HISTORII TRENINGÓW ---
export const getWorkoutHistory = (): HistoryEntry[] => {
  const data = localStorage.getItem(KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const addToHistory = (entry: HistoryEntry): void => {
  const history = getWorkoutHistory();
  localStorage.setItem(KEYS.HISTORY, JSON.stringify([entry, ...history]));
};

export const deleteHistoryItem = (id: string): void => {
  const history = getWorkoutHistory().filter(h => h.id !== id);
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
};

export const clearHistory = (): void => {
  localStorage.removeItem(KEYS.HISTORY);
};

// --- LOGIKA LISTY ZAKUPÓW ---
export const getShoppingList = (): ShoppingItem[] => {
  const data = localStorage.getItem(KEYS.SHOPPING);
  return data ? JSON.parse(data) : [];
};

export const addToShoppingList = (items: Omit<ShoppingItem, 'id'>[]): void => {
  const current = getShoppingList();
  const newItems = items.map(i => ({ 
    ...i, 
    id: Math.random().toString(36).substr(2, 9) 
  }));
  localStorage.setItem(KEYS.SHOPPING, JSON.stringify([...current, ...newItems]));
};

export const removeFromShoppingList = (id: string): void => {
  const newList = getShoppingList().filter(item => item.id !== id);
  localStorage.setItem(KEYS.SHOPPING, JSON.stringify(newList));
};

// --- KALKULATOR CELÓW KALORYCZNYCH ---
export const calculateDailyGoals = (profile: UserProfile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  
  // BMR (Wzór Mifflin-St Jeor)
  let bmr = gender === 'male' 
    ? 10 * weight + 6.25 * height - 5 * age + 5 
    : 10 * weight + 6.25 * height - 5 * age - 161;
  
  // Mnożniki aktywności
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * multipliers[activityLevel - 1];
  
  // Korekta pod cel
  let calories = Math.round(goal === 'cut' ? tdee - 500 : goal === 'bulk' ? tdee + 300 : tdee);
  let protein = Math.round(weight * (goal === 'cut' ? 2.2 : 1.8));
  let fat = Math.round((calories * 0.25) / 9);
  let carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
  
  return {
    calories,
    protein,
    carbs,
    fat,
    steps: 10000,
  };
};