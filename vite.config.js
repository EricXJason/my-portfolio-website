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
  base: "./",
  build: {
    // Target modern browsers only — eliminates unnecessary polyfills
    target: "esnext",
    // Vite 8 uses oxc (native Rust minifier) — no esbuild dependency needed
    minify: true,
    cssMinify: true,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        // Fine-grained manual chunks: keeps vendor code separate from app code
        // and splits the heaviest sections into their own async chunks
        manualChunks(id) {
          // ── Vendor: React runtime ────────────────────────────────────────
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
            return "vendor-react";
          }
          // ── Vendor: Lucide icons ────────────────────────────────────────
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-lucide";
          }
          // ── Vendor: remaining node_modules ─────────────────────────────
          if (id.includes("node_modules")) {
            return "vendor";
          }
          // ── App: heavy below-fold sections (lazy-loaded in MainSiteContent) ─
          if (id.includes("/components/ArtGallery")) {
            return "section-gallery";
          }
          if (id.includes("/components/Education")) {
            return "section-education";
          }
          if (id.includes("/components/Certifications")) {
            return "section-certifications";
          }
          if (id.includes("/components/Projects")) {
            return "section-projects";
          }
          // ── App: decorative background (desktop-only, large file) ───────
          if (id.includes("/components/FullStackCodeStreamBackground")) {
            return "bg-code-stream";
          }
        },
      },
    },
  },
});
