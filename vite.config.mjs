import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import removeConsole from 'vite-plugin-remove-console';

export default defineConfig({
  plugins: [react(), tailwindcss(), removeConsole()],
  server: {
    port: 3000, // Change this if needed
    proxy: {
      '/api': {
        target: 'http://localhost:39189',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});