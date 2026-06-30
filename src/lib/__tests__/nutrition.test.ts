import { describe, it, expect } from 'vitest';
import {
  calculateBMR, resolveActivityMultiplier, calculateTDEE, calculateTargets, ACTIVITY_LEVELS,
} from '../nutrition';
import type { UserProfile } from '../user-store';

const bio = { weight: 80, height: 180, age: 25, gender: 'male' as const };

describe('calculateBMR (Mifflin-St Jeor)', () => {
  it('mężczyzna: +5', () => {
    // 10*80 + 6.25*180 - 5*25 + 5 = 1805
    expect(calculateBMR(bio)).toBe(1805);
  });
  it('kobieta: -161', () => {
    expect(calculateBMR({ ...bio, gender: 'female' })).toBe(1639);
  });
});

describe('resolveActivityMultiplier', () => {
  it('mnożnik przechodzi bez zmian', () => expect(resolveActivityMultiplier(1.55)).toBe(1.55));
  it('legacy indeks 1..5 -> mnożnik', () => {
    expect(resolveActivityMultiplier(1)).toBe(ACTIVITY_LEVELS[0].level);
    expect(resolveActivityMultiplier(3)).toBe(ACTIVITY_LEVELS[2].level);
  });
  it('brak/NaN -> domyślny 1.375', () => {
    expect(resolveActivityMultiplier(undefined)).toBe(1.375);
    expect(resolveActivityMultiplier(0)).toBe(1.375);
  });
});

describe('calculateTDEE', () => {
  it('BMR * mnożnik', () => {
    expect(calculateTDEE({ ...bio, activityLevel: 1.55 })).toBeCloseTo(2797.75, 2);
  });
});

describe('calculateTargets', () => {
  const make = (goal: UserProfile['goal']) =>
    calculateTargets({ ...bio, activityLevel: 1.55, goal } as UserProfile);

  it('recomp = TDEE (zaokrąglone)', () => {
    expect(make('recomp').calories).toBe(2798);
  });
  it('cut = -500', () => expect(make('cut').calories).toBe(2298));
  it('bulk = +300', () => expect(make('bulk').calories).toBe(3098));

  it('makro sumuje się do kalorii (±5 kcal przez zaokrąglenia)', () => {
    const t = make('recomp');
    const sum = t.protein * 4 + t.carbs * 4 + t.fat * 9;
    expect(Math.abs(sum - t.calories)).toBeLessThanOrEqual(6);
  });

  it('białko = 2 g/kg, węgle/tłuszcze nieujemne', () => {
    const t = make('recomp');
    expect(t.protein).toBe(160);
    expect(t.carbs).toBeGreaterThanOrEqual(0);
    expect(t.fat).toBeGreaterThan(0);
  });

  it('dolny limit bezpieczeństwa 1200 kcal', () => {
    const tiny = calculateTargets({ weight: 40, height: 150, age: 80, gender: 'female', activityLevel: 1.2, goal: 'cut' } as UserProfile);
    expect(tiny.calories).toBeGreaterThanOrEqual(1200);
  });
});
