// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // A raiz agora é o diretório atual
  build: {
    outDir: 'dist', // Diretório de saída para os arquivos construídos
    assetsInlineLimit: 0, // Isso garante que todos os assets sejam tratados como arquivos

  },
});
