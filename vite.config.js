import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import componentTagger from "vite-plugin-component-tagger";

export default defineConfig(({ mode }) => ({
  build: {
    outDir: "public_html",  // ⚠️ careful: relative to project root
  },

  base: "/",   // ✅ ADD THIS LINE
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));