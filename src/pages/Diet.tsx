import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ScanLine, 
  Camera, 
  Plus, 
  Search,
  ChefHat,
  ShoppingBag,
  ChevronRight 
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProgressRing from '@/components/ui/ProgressRing';
import { getUserProfile, calculateDailyGoals, getTodayStats } from '@/lib/user-store';

const meals = [
  { id: 1, name: 'Śniadanie', time: '8:00', calories: 450, items: ['Jajecznica', 'Tost', 'Awokado'] },
  { id: 2, name: 'Obiad', time: '13:00', calories: 680, items: ['Kurczak', 'Ryż', 'Brokuły'] },
  { id: 3, name: 'Przekąska', time: '16:00', calories: 180, items: ['Jogurt grecki', 'Orzechy'] },
];

const recipes = [
  { id: 1, name: 'Bowl proteinowy', calories: 520, protein: 42, time: '15 min', emoji: '🥗' },
  { id: 2, name: 'Shakshuka fit', calories: 380, protein: 28, time: '20 min', emoji: '🍳' },
  { id: 3, name: 'Wrap z indykiem', calories: 450, protein: 35, time: '10 min', emoji: '🌯' },
  { id: 4, name: 'Smoothie bowl', calories: 320, protein: 24, time: '5 min', emoji: '🫐' },
];

const fridgeItems = [
  { name: 'Jajka', qty: '12 szt', emoji: '🥚' },
  { name: 'Pierś z kurczaka', qty: '500g', emoji: '🍗' },
  { name: 'Brokuły', qty: '300g', emoji: '🥦' },
  { name: 'Ryż basmati', qty: '1kg', emoji: '🍚' },
  { name: 'Jogurt grecki', qty: '400g', emoji: '🥛' },
];

const Diet = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const profile = getUserProfile();
  const stats = getTodayStats();
  const goals = profile ? calculateDailyGoals(profile) : null;

  if (!goals) return null;

  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const caloriesProgress = (totalCalories / goals.calories) * 100;

  return (
    <AppLayout>
      <div className="px-5 pt-12 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold">Dieta</h1>
          <p className="text-muted-foreground">Zarządzaj swoim żywieniem</p>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="kilo-card mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Dzisiaj</p>
              <p className="text-3xl font-bold">
                {totalCalories}
                <span className="text-lg text-muted-foreground font-normal">
                  /{goals.calories} kcal
                </span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Pozostało: {goals.calories - totalCalories} kcal
              </p>
            </div>
            <ProgressRing progress={caloriesProgress} size={80} strokeWidth={6}>
              <span className="text-sm font-bold">{Math.round(caloriesProgress)}%</span>
            </ProgressRing>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Button 
            variant="outline" 
            className="h-16 rounded-2xl border-0 bg-card flex items-center justify-center gap-3"
          >
            <ScanLine size={24} />
            <span>Skanuj kod</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-16 rounded-2xl border-0 bg-card flex items-center justify-center gap-3"
          >
            <Camera size={24} />
            <span>Skanuj paragon</span>
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="meals">
          <TabsList className="grid w-full grid-cols-3 bg-card rounded-2xl h-12 mb-6">
            <TabsTrigger value="meals" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Posiłki
            </TabsTrigger>
            <TabsTrigger value="recipes" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Przepisy
            </TabsTrigger>
            <TabsTrigger value="fridge" className="rounded-xl data-[state=active]:bg-foreground data-[state=active]:text-background">
              Lodówka
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meals" className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj produktu..."
                className="h-12 pl-12 bg-card border-0 rounded-2xl"
              />
            </div>

            {/* Meals */}
            {meals.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="kilo-card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{meal.name}</span>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meal.items.join(' • ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{meal.calories}</p>
                    <p className="text-xs text-muted-foreground">kcal</p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add Meal */}
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-dashed"
            >
              <Plus size={20} className="mr-2" />
              Dodaj posiłek
            </Button>
          </TabsContent>

          <TabsContent value="recipes" className="space-y-4">
            {/* AI Suggestion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="kilo-card bg-gradient-to-br from-card to-card/50"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                  <ChefHat size={28} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">AI Chef</p>
                  <p className="text-sm text-muted-foreground">
                    Generuj przepisy z produktów w lodówce
                  </p>
                </div>
                <ChevronRight size={20} className="text-muted-foreground" />
              </div>
            </motion.div>

            {/* Recipes Grid */}
            <div className="grid grid-cols-2 gap-3">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="kilo-card"
                >
                  <div className="text-4xl mb-3">{recipe.emoji}</div>
                  <p className="font-semibold text-sm mb-1">{recipe.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {recipe.calories} kcal • {recipe.protein}g białka
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">⏱ {recipe.time}</p>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fridge" className="space-y-4">
            {/* Scan Receipt */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full kilo-card flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-foreground/10 flex items-center justify-center">
                <ShoppingBag size={28} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold">Skanuj paragon</p>
                <p className="text-sm text-muted-foreground">
                  AI automatycznie doda produkty
                </p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </motion.button>

            {/* Fridge Items */}
            <div className="space-y-3">
              {fridgeItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="kilo-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <span className="text-muted-foreground">{item.qty}</span>
                </motion.div>
              ))}
            </div>

            {/* Add Item */}
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl border-dashed"
            >
              <Plus size={20} className="mr-2" />
              Dodaj produkt
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Diet;
