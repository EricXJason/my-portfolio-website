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
  plugins: [react(), tailwindcss()],
  base: process.env.CF_PAGES ? "/" : (process.env.VITE_BASE_PATH || "/my-portfolio-website/"),
  build: {
    cssMinify: true,
    target: "es2020",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom")) {
              return "vendor-react";
            }
            if (id.includes("lucide-react")) {
              return "vendor-lucide";
            }
            return "vendor";
          }
        },
      },
    },
  },


});
