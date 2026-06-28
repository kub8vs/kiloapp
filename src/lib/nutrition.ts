// --- KILO: SILNIK ODŻYWIANIA (jedyne źródło prawdy) ---
// Wszystkie obliczenia kalorii i makro liczymy TUTAJ. Onboarding, Diet i Dashboard
// korzystają z tych samych funkcji, żeby nigdy nie pokazywać rozjeżdżających się liczb.

import type { UserProfile } from './user-store';

// Poziomy aktywności = mnożniki TDEE. Jedna definicja używana też w Onboardingu.
export const ACTIVITY_LEVELS = [
  { level: 1.2, label: 'Minimalna', desc: 'Brak ćwiczeń, praca siedząca' },
  { level: 1.375, label: 'Lekka', desc: '1-2 treningi w tygodniu' },
  { level: 1.55, label: 'Średnia', desc: '3-5 treningów tygodniowo' },
  { level: 1.725, label: 'Wysoka', desc: 'Ciężka praca fizyczna + treningi' },
  { level: 1.9, label: 'Ekstremalna', desc: 'Sportowiec / 2 treningi dziennie' },
] as const;

// Korekta kaloryczna względem celu (zgodna z opisami w Onboardingu).
export const GOAL_ADJUSTMENTS: Record<UserProfile['goal'], number> = {
  cut: -500,
  recomp: 0,
  bulk: 300,
};

const PROTEIN_PER_KG = 2.0; // g białka na kg masy ciała
const FAT_KCAL_RATIO = 0.25; // udział tłuszczu w kaloriach
const KCAL_PER_G = { protein: 4, carbs: 4, fat: 9 } as const;
const MIN_CALORIES = 1200; // bezpieczna dolna granica

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  steps: number;
}

type BioData = Pick<UserProfile, 'weight' | 'height' | 'age' | 'gender'>;

// Normalizacja: obsługa starych profili, gdzie activityLevel bywał indeksem 1..5.
export const resolveActivityMultiplier = (activityLevel: number | undefined): number => {
  const a = Number(activityLevel);
  if (!a || Number.isNaN(a)) return 1.375;
  if (Number.isInteger(a) && a >= 1 && a <= 5) return ACTIVITY_LEVELS[a - 1].level; // legacy indeks
  return a; // już mnożnik (1.2–1.9)
};

// Mifflin-St Jeor
export const calculateBMR = (bio: BioData): number => {
  const base = 10 * bio.weight + 6.25 * bio.height - 5 * bio.age;
  return bio.gender === 'male' ? base + 5 : base - 161;
};

export const calculateTDEE = (profile: BioData & { activityLevel: number }): number => {
  return calculateBMR(profile) * resolveActivityMultiplier(profile.activityLevel);
};

// Główna funkcja: cele dzienne (kcal + makro). Makro sumuje się do kcal (białko stałe,
// tłuszcz jako % kcal, węgle jako reszta), więc liczby są spójne.
export const calculateTargets = (profile: UserProfile): NutritionTargets => {
  const tdee = calculateTDEE(profile);
  const adjustment = GOAL_ADJUSTMENTS[profile.goal] ?? 0;
  const calories = Math.max(MIN_CALORIES, Math.round(tdee + adjustment));

  const protein = Math.round(profile.weight * PROTEIN_PER_KG);
  const fat = Math.round((calories * FAT_KCAL_RATIO) / KCAL_PER_G.fat);
  const carbs = Math.max(
    0,
    Math.round((calories - protein * KCAL_PER_G.protein - fat * KCAL_PER_G.fat) / KCAL_PER_G.carbs),
  );

  return { calories, protein, carbs, fat, steps: 10000 };
};
