import { GoogleGenerativeAI } from "@google/generative-ai";
import * as Store from "./user-store";

const genAI = new GoogleGenerativeAI("AIzaSyA9uvyWOKyJnbgFXYk92cAitb4WRZTtor8");

export const askTrainer = async (trainerRole: string, userMessage: string) => {
  try {
    const profile = Store.getUserProfile();
    
    // ZMIANA: Zamiast "gemini-1.5-flash", używamy "gemini-pro"
    // To model sugerowany w Twojej pomocy z konsoli
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `Jesteś trenerem KILO ELITE. Specjalizacja: ${trainerRole}. Zawodnik: ${profile?.name}. Cel: ${profile?.goal}. Odpowiadaj krótko po polsku.`;

    const result = await model.generateContent(systemPrompt + "\nPytanie: " + userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Błąd Gemini:", error);
    return "Trener ma teraz przerwę techniczną. Spróbuj za chwilę!";
  }
};