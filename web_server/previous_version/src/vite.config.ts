import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate source maps for production
    sourcemap: true,
    // Configure rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          vendor: ['react', 'react-dom'],
          // Split leaflet into its own chunk
          leaflet: ['leaflet']
        }
      }
    }
  },
  server: {
    // Configure proxy for development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
});