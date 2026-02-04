import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Store from "./user-store";

const API_KEY = "AIzaSyA9uvyWOKyJnbgFXYk92cAitb4WRZTtor8";
const genAI = new GoogleGenerativeAI(API_KEY);

export const askTrainer = async (trainerRole: string, userMessage: string) => {
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