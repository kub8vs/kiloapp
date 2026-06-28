// --- KILO: WYDATEK ENERGETYCZNY TRENINGU (oparty na badaniach) ---
// Metoda MET (Metabolic Equivalent of Task) wg ACSM oraz
// Compendium of Physical Activities (Ainsworth i in., 2011).
// Równanie metaboliczne ACSM: kcal/min = MET * 3.5 * masa_kg / 200

// MET dla marszu/biegu w zależności od prędkości (km/h) — wartości z Compendium 2011.
export const speedToMET = (kmh: number): number => {
  if (kmh <= 0) return 3.5;
  if (kmh < 5) return 3.0;     // spacer
  if (kmh < 6.5) return 4.3;   // szybki marsz
  if (kmh < 8) return 6.0;     // trucht
  if (kmh < 9.7) return 8.3;   // bieg ~8 km/h
  if (kmh < 11.3) return 9.8;  // ~10 km/h
  if (kmh < 12.9) return 11.0; // ~12 km/h
  if (kmh < 14.5) return 11.8; // ~14 km/h
  return 12.8;                 // > 14.5 km/h
};

// Trening oporowy: Compendium podaje 3.5 (umiarkowany) – 6.0 (intensywny). Bierzemy 5.0.
export const STRENGTH_MET = 5.0;

export const kcalFromMET = (met: number, weightKg: number, minutes: number): number => {
  const w = weightKg > 0 ? weightKg : 70;
  const min = Math.max(0, minutes);
  return Math.round((met * 3.5 * w / 200) * min);
};

// Cardio: z dystansu (km) i czasu (s) wyliczamy prędkość -> MET -> kcal.
export const cardioCalories = (distanceKm: number, durationSec: number, weightKg: number): number => {
  const minutes = durationSec / 60;
  if (minutes <= 0) return 0;
  const kmh = distanceKm > 0 ? distanceKm / (minutes / 60) : 0;
  return kcalFromMET(speedToMET(kmh), weightKg, minutes);
};

// Siłowy: z czasu trwania sesji (s).
export const strengthCalories = (durationSec: number, weightKg: number): number => {
  return kcalFromMET(STRENGTH_MET, weightKg, durationSec / 60);
};
