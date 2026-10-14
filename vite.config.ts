import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base path to ensure seamless deployment on GitHub Pages, Vercel, or custom subpaths
  base: './',
  server: {
    port: 5173,
    open: false,
  },
});
