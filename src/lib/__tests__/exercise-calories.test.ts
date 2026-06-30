import { describe, it, expect } from 'vitest';
import { speedToMET, kcalFromMET, cardioCalories, strengthCalories } from '../exercise-calories';

describe('speedToMET (Compendium 2011)', () => {
  it('spacer < 5 km/h', () => expect(speedToMET(4)).toBe(3.0));
  it('trucht ~7', () => expect(speedToMET(7)).toBe(6.0));
  it('bieg 10 km/h', () => expect(speedToMET(10)).toBe(9.8));
  it('bardzo szybko > 14.5', () => expect(speedToMET(20)).toBe(12.8));
  it('zero/ujemne -> bazowy 3.5', () => expect(speedToMET(0)).toBe(3.5));
});

describe('kcalFromMET (równanie ACSM)', () => {
  it('8 MET, 80 kg, 30 min = 336 kcal', () => {
    expect(kcalFromMET(8, 80, 30)).toBe(336);
  });
  it('brak masy -> fallback 70 kg', () => {
    expect(kcalFromMET(8, 0, 30)).toBe(kcalFromMET(8, 70, 30));
  });
});

describe('cardioCalories', () => {
  it('5 km w 30 min (10 km/h), 80 kg', () => {
    expect(cardioCalories(5, 1800, 80)).toBe(412);
  });
  it('zerowy czas = 0 kcal', () => expect(cardioCalories(5, 0, 80)).toBe(0));
});

describe('strengthCalories', () => {
  it('60 min, 80 kg, MET 5 = 420 kcal', () => {
    expect(strengthCalories(3600, 80)).toBe(420);
  });
});
