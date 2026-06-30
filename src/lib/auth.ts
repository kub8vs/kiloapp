// --- KILO: warstwa autoryzacji (anon + łączenie z Google/Apple) ---
import { auth } from './firebase';
import {
  onAuthStateChanged, signInAnonymously, GoogleAuthProvider, OAuthProvider,
  signInWithPopup, linkWithPopup, type AuthProvider, type User,
} from 'firebase/auth';
import { loadFromCloud } from './cloud-sync';
import { hydrateFromCloud } from './user-store';

let started = false;

const hydrate = async (uid: string) => {
  const cloud = await loadFromCloud(uid);
  if (cloud) hydrateFromCloud(cloud);
};

// Wywołać RAZ przy starcie. Rozwiązuje się, gdy stan auth jest gotowy
// (lub po timeout, by nie blokować aplikacji offline).
export const initAuth = (): Promise<void> =>
  new Promise((resolve) => {
    if (started) return resolve();
    started = true;
    const timeout = setTimeout(resolve, 2500);
    onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          await signInAnonymously(auth); // wywoła ten callback ponownie z userem
          return;
        }
        await hydrate(user.uid); // odczyt danych z chmury -> localStorage
      } catch (e) {
        console.warn('initAuth:', e);
      } finally {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

const connect = async (provider: AuthProvider): Promise<User | null> => {
  const current = auth.currentUser;
  try {
    // Konto anonimowe -> awans do stałego (zachowuje uid i dane).
    if (current?.isAnonymous) {
      const res = await linkWithPopup(current, provider);
      await hydrate(res.user.uid);
      return res.user;
    }
    const res = await signInWithPopup(auth, provider);
    await hydrate(res.user.uid);
    return res.user;
  } catch (e) {
    // np. konto już istnieje -> zwykłe logowanie i pobranie jego danych.
    try {
      const res = await signInWithPopup(auth, provider);
      await hydrate(res.user.uid);
      return res.user;
    } catch (e2) {
      console.warn('connect:', e2);
      return null;
    }
  }
};

export const linkGoogle = () => connect(new GoogleAuthProvider());
export const linkApple = () => connect(new OAuthProvider('apple.com'));
