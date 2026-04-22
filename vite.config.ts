import { defineConfig } from 'vite';

export default defineConfig({
  base: '/demo-react/', // Укажите имя вашего репозитория
  build: {
    outDir: 'dist', // Это стандартное значение для Vite
  }
});