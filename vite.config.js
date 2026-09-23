import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 5500,
    strictPort: true,
  },
  preview: {
    port: 5500,
    strictPort: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: "/",
  build: {
    // Target modern browsers only — eliminates unnecessary polyfills
    target: "esnext",
    // Vite 8 uses oxc (native Rust minifier) — no esbuild dependency needed
    minify: true,
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    modulePreload: false,
    rollupOptions: {
      output: {
        // Fine-grained manual chunks: keeps vendor code separate from app code
        // and splits the heaviest sections into their own async chunks
        manualChunks(id) {
          // ── Vendor: React runtime & Routing ──────────────────────────────
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/@remix-run")
          ) {
            return "vendor-react";
          }
          // ── Vendor: Firebase SDK (lazy loaded on SWR / CMS) ─────────────
          if (id.includes("firebase") || id.includes("@firebase")) {
            return "vendor-firebase";
          }
          // ── Vendor: Lucide icons ────────────────────────────────────────
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-lucide";
          }
        },
      },
    },
  },
});
