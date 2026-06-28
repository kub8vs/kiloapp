import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0", // Słuchaj na wszystkich interfejsach IPv4
    port: 8080,
    strictPort: true, // Ważne, aby port się nie zmienił nagle na 8081
    allowedHosts: [
      "microtonal-fairy-musaceous.ngrok-free.dev",
      ".ngrok-free.dev"
    ],
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "placeholder.svg"],
      manifest: {
        name: "KILO — Trener AI, Dieta, Trening",
        short_name: "KILO",
        description: "KILO — jedna aplikacja: licznik kalorii, trening, cardio z GPS, dieta i trener AI.",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "placeholder.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "placeholder.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "placeholder.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));