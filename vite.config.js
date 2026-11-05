import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' omogućuje da se aplikacija objavi u bilo kojoj mapi na serveru
export default defineConfig({
  base: './',
  plugins: [react()],
});
