import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 5173, // Port par défaut pour Vite
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000', // Adresse de ton serveur Node.js
  //       changeOrigin: true,
  //       // rewrite: (path) => path.replace(/^\/api/, ''), // Rewriting pour enlever le préfixe
  //     },
  //   },
  // },
});
