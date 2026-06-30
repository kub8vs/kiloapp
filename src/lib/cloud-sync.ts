// --- KILO: ODCZYT z chmury (sync dwukierunkowy) ---
// Zapis robi user-store.syncToCloud; tu domykamy brakujący ODCZYT, dzięki czemu
// dane wracają na nowym urządzeniu / po reinstalacji.

import { db } from './firebase';
import { doc, getDoc, type DocumentData } from 'firebase/firestore';

export const loadFromCloud = async (uid: string): Promise<DocumentData | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.warn('loadFromCloud:', e);
    return null;
  }
};
