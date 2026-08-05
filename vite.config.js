import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin: defer full CSS to eliminate render-blocking, inline critical CSS for instant dark bg paint
const deferCssPlugin = () => ({
  name: 'defer-full-css',
  apply: 'build',
  transformIndexHtml(html) {
    // Minimal critical CSS: prevents white flash and provides base font before Tailwind loads
    const criticalCSS =
      'body{margin:0;background:#07090e;color:#f0f6fc;font-family:system-ui,sans-serif}' +
      '#root{min-height:100vh}';
    // Transform stylesheet link to async preload pattern
    return html.replace(
      /(<link rel="stylesheet" crossorigin href="([^"]+)"\s*>)/g,
      (_, full, href) =>
        `<style>${criticalCSS}</style>` +
        `<link rel="preload" as="style" onload="this.onload=null;this.rel='stylesheet'" href="${href}">` +
        `<noscript>${full}</noscript>`
    );
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    deferCssPlugin(),
  ],
  base: '/my-portfolio-website/',
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        }
      }
    }
  },
})
