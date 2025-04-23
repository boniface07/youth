import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Development server port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Local backend for development
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist', // Output directory for production build
    sourcemap: false, // Disable sourcemaps to reduce bundle size
    minify: 'esbuild', // Use esbuild for faster minification
  },
});