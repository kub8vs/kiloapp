// --- KILO: wspólne typy domenowe (koniec z `any`) ---

export interface WorkoutSet {
  weight: string;
  reps: string;
  completed: boolean;
}

export interface ExerciseInstance {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface Routine {
  id: string;
  name: string;
  exercises: ExerciseInstance[];
}

export type WorkoutType = 'strength' | 'cardio';

export interface HistoryEntry {
  id: string;
  type: WorkoutType;
  name: string;
  date: string;
  duration: string;
  details: string;
  vol?: number;
  kcal?: number;
  distance?: number;
  exercises_data?: ExerciseInstance[];
}

export interface AtlasExercise {
  id: string;
  name: string;
  muscle: string;
  video: string;
  tip: string;
}

export interface Recipe {
  id: number;
  name: string;
  cat: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  weight: number;
  difficulty: string;
  ig: string;
  time: string;
  micros: string;
  image: string;
  ingredients: string[];
  steps: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  color: string;
}
