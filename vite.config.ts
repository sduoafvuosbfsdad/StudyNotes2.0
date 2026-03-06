import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('framer-motion')) {
            return 'motion';
          }

          if (id.includes('katex')) {
            return 'katex';
          }

          if (id.includes('cmdk')) {
            return 'cmdk';
          }

          if (id.includes('@radix-ui/react-dialog')) {
            return 'dialog';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
