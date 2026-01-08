import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, ChevronDown, Play, Clock, Flame } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ExerciseSet {
  id: string;
  weight: string;
  reps: string;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
}

const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Wyciskanie sztangi leżąc',
    sets: [
      { id: '1-1', weight: '80', reps: '8', completed: true },
      { id: '1-2', weight: '85', reps: '6', completed: true },
      { id: '1-3', weight: '85', reps: '6', completed: false },
      { id: '1-4', weight: '80', reps: '8', completed: false },
    ],
  },
  {
    id: '2',
    name: 'Rozpiętki na ławce skośnej',
    sets: [
      { id: '2-1', weight: '16', reps: '12', completed: false },
      { id: '2-2', weight: '16', reps: '12', completed: false },
      { id: '2-3', weight: '14', reps: '15', completed: false },
    ],
  },
  {
    id: '3',
    name: 'Wyciskanie hantli nad głowę',
    sets: [
      { id: '3-1', weight: '24', reps: '10', completed: false },
      { id: '3-2', weight: '24', reps: '10', completed: false },
      { id: '3-3', weight: '22', reps: '12', completed: false },
    ],
  },
];

const Workout = () => {
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [activeExercise, setActiveExercise] = useState<string | null>('1');
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);

  const toggleSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, completed: !s.completed } : s
              ),
            }
          : ex
      )
    );
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    field: 'weight' | 'reps',
    value: string
  ) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: ex.sets.map((s) =>
                s.id === setId ? { ...s, [field]: value } : s
              ),
            }
          : ex
      )
    );
  };

  const addSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exerciseId
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: `${exerciseId}-${ex.sets.length + 1}`,
                  weight: ex.sets[ex.sets.length - 1]?.weight || '0',
                  reps: ex.sets[ex.sets.length - 1]?.reps || '10',
                  completed: false,
                },
              ],
            }
          : ex
      )
    );
  };

  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold">Trening</h1>
          <p className="text-muted-foreground">Push Day - Klatka & Barki</p>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="gym" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-card rounded-2xl h-12">
            <TabsTrigger value="gym" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Siłownia
            </TabsTrigger>
            <TabsTrigger value="cardio" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Cardio
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Historia
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gym" className="mt-6 space-y-4">
            {/* Workout Stats */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="kilo-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-muted-foreground" />
                    <span className="font-semibold">
                      {Math.floor(workoutTime / 60)}:{String(workoutTime % 60).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-muted-foreground" />
                    <span className="font-semibold">~{completedSets * 25} kcal</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg">{completedSets}</span>
                  <span className="text-muted-foreground">/{totalSets} serii</span>
                </div>
              </div>
            </motion.div>

            {/* Exercises */}
            {exercises.map((exercise, index) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="kilo-card"
              >
                <button
                  onClick={() =>
                    setActiveExercise(
                      activeExercise === exercise.id ? null : exercise.id
                    )
                  }
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="font-semibold">{exercise.name}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform ${
                      activeExercise === exercise.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeExercise === exercise.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3"
                  >
                    {/* Header */}
                    <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground px-2">
                      <span>SERIA</span>
                      <span className="text-center">KG</span>
                      <span className="text-center">POWT.</span>
                      <span className="text-right">✓</span>
                    </div>

                    {/* Sets */}
                    {exercise.sets.map((set, setIndex) => (
                      <div
                        key={set.id}
                        className={`grid grid-cols-4 gap-2 items-center p-2 rounded-xl transition-colors ${
                          set.completed ? 'bg-foreground/5' : ''
                        }`}
                      >
                        <span className="font-medium">{setIndex + 1}</span>
                        <Input
                          type="number"
                          value={set.weight}
                          onChange={(e) =>
                            updateSet(exercise.id, set.id, 'weight', e.target.value)
                          }
                          className="h-10 bg-card border-0 rounded-xl text-center"
                        />
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) =>
                            updateSet(exercise.id, set.id, 'reps', e.target.value)
                          }
                          className="h-10 bg-card border-0 rounded-xl text-center"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() => toggleSet(exercise.id, set.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              set.completed
                                ? 'bg-foreground text-background'
                                : 'bg-card'
                            }`}
                          >
                            <Check size={18} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Set */}
                    <button
                      onClick={() => addSet(exercise.id)}
                      className="w-full py-3 rounded-xl border border-dashed border-border text-muted-foreground flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={16} />
                      Dodaj serię
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* Add Exercise Button */}
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-dashed"
            >
              <Plus size={20} className="mr-2" />
              Dodaj ćwiczenie
            </Button>
          </TabsContent>

          <TabsContent value="cardio" className="mt-6">
            <div className="kilo-card text-center py-12">
              <div className="w-20 h-20 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
                <Play size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">Rozpocznij cardio</h3>
              <p className="text-muted-foreground mb-6">
                Śledź swoją trasę biegu lub jazdy na rowerze
              </p>
              <Button className="rounded-2xl h-12 px-8 bg-foreground text-background hover:bg-foreground/90">
                Start
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="kilo-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Push Day</p>
                    <p className="text-sm text-muted-foreground">
                      {i} {i === 1 ? 'dzień' : 'dni'} temu • 45 min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">12 serii</p>
                    <p className="text-sm text-muted-foreground">~300 kcal</p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Workout;
