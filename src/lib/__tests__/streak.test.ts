import { describe, it, expect } from 'vitest';
import { streakFromLogs } from '../streak';
import type { DailyLog } from '../user-store';

const day = (water: number, items: number): DailyLog => ({
  date: '',
  water,
  meals: {
    breakfast: { name: 'b', items: Array.from({ length: items }, () => ({ id: 1, name: 'x', kcal: 1, p: 0, c: 0, f: 0, weight: 1 })) },
    lunch: { name: 'l', items: [] },
    dinner: { name: 'd', items: [] },
    snacks: { name: 's', items: [] },
  },
});

const FROM = new Date('2025-01-10T12:00:00');

describe('streakFromLogs', () => {
  it('liczy kolejne aktywne dni do dziś', () => {
    const map: Record<string, DailyLog> = {
      '2025-01-10': day(0, 1),
      '2025-01-09': day(2, 0),
      '2025-01-08': day(0, 1),
      // 2025-01-07 brak -> przerwa
    };
    expect(streakFromLogs(map, FROM)).toBe(3);
  });

  it('dzień dzisiejszy pusty -> liczy od wczoraj', () => {
    const map: Record<string, DailyLog> = {
      '2025-01-09': day(1, 0),
      '2025-01-08': day(0, 2),
    };
    expect(streakFromLogs(map, FROM)).toBe(2);
  });

  it('brak aktywności -> 0', () => {
    expect(streakFromLogs({}, FROM)).toBe(0);
  });
});
