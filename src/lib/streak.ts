// Czysta logika serii (testowalna, bez zależności od Firebase).
import type { DailyLog } from './user-store';

const dayKey = (dt: Date) => dt.toISOString().split('T')[0];
const isActive = (log?: DailyLog) =>
  !!log && (log.water > 0 || Object.values(log.meals).some((m) => m.items.length > 0));

export const streakFromLogs = (map: Record<string, DailyLog>, from: Date = new Date()): number => {
  const d = new Date(from);
  if (!isActive(map[dayKey(d)])) d.setDate(d.getDate() - 1); // nie zerujemy w środku dnia
  let streak = 0;
  for (let i = 0; i < 400; i++) {
    if (!isActive(map[dayKey(d)])) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
};
