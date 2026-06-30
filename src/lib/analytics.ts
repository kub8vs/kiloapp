// --- KILO: analityka zdarzeń (Firebase Analytics) ---
// Cienki, bezpieczny wrapper. Punkt rozszerzenia o lejek/funnel.
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

export const track = (event: string, params?: Record<string, string | number | boolean>) => {
  try {
    if (analytics) logEvent(analytics, event, params);
  } catch (e) {
    /* analytics nie jest krytyczne */
  }
};
