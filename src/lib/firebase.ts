import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Dodane dla bazy danych
import { getAuth } from "firebase/auth";           // Dodane dla kont użytkowników

const firebaseConfig = {
  apiKey: "AIzaSyDzm5EEyA_kbUwtm8fWUXGM2nh1dPLnZq8",
  authDomain: "kilo-93816.firebaseapp.com",
  projectId: "kilo-93816",
  storageBucket: "kilo-93816.firebasestorage.app",
  messagingSenderId: "890834654987",
  appId: "1:890834654987:web:0fbe503fbf13795af7f40e",
  measurementId: "G-S6K7E7MMWW"
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);

// Eksportujemy konkretne usługi, żeby móc ich używać w innych plikach
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;