import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Store from "./user-store";

// Klucz NIE może być zaszyty w kodzie. Ustaw VITE_GEMINI_API_KEY w pliku .env
// (patrz .env.example). Docelowo: proxy/Cloud Function zamiast klucza w kliencie.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const askTrainer = async (trainerRole: string, userMessage: string) => {
  if (!genAI) {
    return "Trener AI jest chwilowo niedostępny — brak konfiguracji klucza API.";
  }
  try {
    const profile = Store.getUserProfile();
    // Wymuszamy wersję v1, aby uniknąć błędu 404
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      { apiVersion: "v1" }
    );

    const systemPrompt = `Jesteś trenerem KILO ELITE. Specjalizacja: ${trainerRole}. Zawodnik: ${profile?.name || 'Mistrz'}. Cel: ${profile?.goal || 'Progres'}. Odpowiadaj krótko (max 3 zdania) po polsku.`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\nPytanie: " + userMessage }] }],
    });

    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Błąd AI:", error);
    return "Trener ma teraz przerwę. Spróbuj za chwilę!";
  }
};