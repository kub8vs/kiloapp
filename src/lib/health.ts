// --- KILO: WARSTWA ZDROWIA (kroki) ---
// Na platformie natywnej (Capacitor) gotowa pod HealthKit / Google Fit.
// Na web fallback do wartości zapisanej lokalnie (np. wpisanej ręcznie).

import { Capacitor } from '@capacitor/core';
import { getSteps, saveSteps } from './user-store';

export const isNativePlatform = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch (e) {
    return false;
  }
};

// Odczyt kroków. Docelowo (natywne): plugin health (HealthKit / Google Fit) —
// wymaga buildu natywnego + uprawnień, do weryfikacji na urządzeniu.
// Obecnie zwraca trwałą, realną wartość (zamiast zahardkodowanego 0).
export const syncSteps = async (): Promise<number> => {
  // TODO(natywne): podłączyć plugin health i nadpisać saveSteps wynikiem z systemu.
  return getSteps();
};

export const setManualSteps = (steps: number): number => {
  const safe = Math.max(0, Math.round(Number(steps) || 0));
  saveSteps(safe);
  return safe;
};
