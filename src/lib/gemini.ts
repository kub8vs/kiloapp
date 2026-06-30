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
  } catch (error) {
    console.error("Błąd AI:", error);
    return "Trener ma teraz przerwę. Spróbuj za chwilę!";
  }
};

export interface PlanDay {
  day: string;
  focus: string;
  exercises: string[];
}

// Generator tygodniowego planu treningowego (AI, structured JSON). Gotowy do wpięcia w UI.
export const generateWeeklyPlan = async (
  goal: string,
  level: string,
  env: string,
): Promise<PlanDay[] | null> => {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
    const prompt =
      `Jesteś trenerem KILO. Ułóż 7-dniowy plan treningowy. Cel: ${goal}. Poziom: ${level}. ` +
      `Środowisko: ${env}. Odpowiedz WYŁĄCZNIE czystym JSON (bez markdown): ` +
      `[{"day":"Poniedziałek","focus":"Klatka i triceps","exercises":["Wyciskanie sztangi 4x8","..."]}].`;
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();
    const m = text.match(/\[[\s\S]*\]/);
    return m ? (JSON.parse(m[0]) as PlanDay[]) : null;
  } catch (error) {
    console.error("Błąd generowania planu:", error);
    return null;
  }
};

export interface MealAnalysis {
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  weight: number;
}

// Skaner posiłków: zdjęcie -> rozpoznanie dania i oszacowanie makro (Gemini Vision).
export const analyzeMealPhoto = async (imageDataUrl: string): Promise<MealAnalysis | null> => {
  if (!genAI) return null;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });

    const match = imageDataUrl.match(/^data:(.+);base64,(.*)$/);
    const mimeType = match?.[1] || "image/jpeg";
    const data = match?.[2] || imageDataUrl;

    const prompt =
      "Jesteś ekspertem żywieniowym KILO. Rozpoznaj danie na zdjęciu i oszacuj wartości " +
      "odżywcze dla widocznej porcji. Odpowiedz WYŁĄCZNIE czystym JSON (bez markdown, bez ```), " +
      'w formacie: {"name":"nazwa po polsku","weight":gramy,"kcal":liczba,"p":bialko_g,"c":wegle_g,"f":tluszcz_g}. ' +
      'Jeśli to nie jedzenie: {"name":"Nie rozpoznano","weight":0,"kcal":0,"p":0,"c":0,"f":0}.';

    const result = await model.generateContent([
      prompt,
      { inlineData: { mimeType, data } },
    ]);

    const text = (await result.response).text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      name: String(parsed.name || "Posiłek"),
      kcal: Math.max(0, Math.round(Number(parsed.kcal) || 0)),
      p: Math.max(0, Math.round(Number(parsed.p) || 0)),
      c: Math.max(0, Math.round(Number(parsed.c) || 0)),
      f: Math.max(0, Math.round(Number(parsed.f) || 0)),
      weight: Math.max(1, Math.round(Number(parsed.weight) || 100)),
    };
  } catch (error) {
    console.error("Błąd analizy zdjęcia:", error);
    return null;
  }
};