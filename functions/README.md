# KILO — Functions (szkielet backendu)

Proxy AI, żeby **klucz Gemini nie był w kliencie** (P0 bezpieczeństwa z `AUDIT.md`).

## Wdrożenie (właściciel)
```sh
cd functions && npm install
firebase functions:secrets:set GEMINI_API_KEY   # wklej NOWY (zrotowany) klucz
firebase deploy --only functions
```

## Podłączenie klienta
Zamień bezpośrednie wywołanie Gemini w `src/lib/gemini.ts` na:
```ts
import { getFunctions, httpsCallable } from "firebase/functions";
const fn = httpsCallable(getFunctions(), "askTrainer");
const { data } = await fn({ role, message });
```
Wtedy `VITE_GEMINI_API_KEY` znika z klienta całkowicie.

> Status: szkielet gotowy do wdrożenia. Nie wdrożono tutaj (brak dostępu do projektu Firebase).
