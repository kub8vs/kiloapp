/* eslint-disable */
// --- KILO: szkielet backendu (Firebase Cloud Functions) ---
// Cel: przenieść klucz AI z klienta na serwer (P0 bezpieczeństwa).
// Wdrożenie (po stronie właściciela):
//   firebase functions:secrets:set GEMINI_API_KEY
//   firebase deploy --only functions
// Klient woła to przez httpsCallable("askTrainer") zamiast trzymać klucz.

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const getModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: "v1" });
};

exports.askTrainer = onCall({ secrets: ["GEMINI_API_KEY"] }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Wymagane logowanie.");
  const { role = "Trener", message = "" } = request.data || {};
  if (!message.trim()) throw new HttpsError("invalid-argument", "Pusta wiadomość.");
  const prompt =
    `Jesteś trenerem KILO ELITE. Specjalizacja: ${role}. ` +
    `Odpowiadaj krótko (max 3 zdania) po polsku.\n\nPytanie: ${message}`;
  const result = await getModel().generateContent(prompt);
  return { text: (await result.response).text() };
});
