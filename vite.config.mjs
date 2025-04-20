import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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