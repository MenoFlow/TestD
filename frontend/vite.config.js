import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://test-d-brown.vercel.app:3000', // URL de ton backend local
        changeOrigin: true,
        secure: false,
      },
    },
  },
});



