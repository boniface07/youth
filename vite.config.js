import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // For local dev
    },
  },
  build: {
    outDir: '../dist', // Output build files here
  },
});