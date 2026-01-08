// Simple user data store using localStorage
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

const STORAGE_KEY = 'kilo_user_profile';

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const isOnboardingCompleted = (): boolean => {
  const profile = getUserProfile();
  return profile?.onboardingCompleted ?? false;
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Daily stats
export interface DailyStats {
  date: string;
  steps: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  workoutCompleted: boolean;
}

const STATS_KEY = 'kilo_daily_stats';

export const getTodayStats = (): DailyStats => {
  const today = new Date().toISOString().split('T')[0];
  const data = localStorage.getItem(STATS_KEY);
  
  if (data) {
    try {
      const stats = JSON.parse(data);
      if (stats.date === today) {
        return stats;
      }
    } catch {
      // ignore
    }
  }
  
  // Return default stats for today
  return {
    date: today,
    steps: Math.floor(Math.random() * 5000) + 4000, // Mock data
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    workoutCompleted: false,
  };
};

export const saveDailyStats = (stats: DailyStats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

// Calculate daily goals based on profile
export const calculateDailyGoals = (profile: UserProfile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  
  // BMR using Mifflin-St Jeor
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
  const tdee = bmr * activityMultipliers[activityLevel - 1];
  
  // Goal adjustments
  let calories: number;
  let proteinMultiplier: number;
  
  switch (goal) {
    case 'cut':
      calories = tdee - 500;
      proteinMultiplier = 2.2;
      break;
    case 'bulk':
      calories = tdee + 300;
      proteinMultiplier = 1.8;
      break;
    case 'recomp':
    default:
      calories = tdee;
      proteinMultiplier = 2.0;
  }
  
  const protein = Math.round(weight * proteinMultiplier);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  
  return {
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    steps: 10000,
  };
};
