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

          if (id.includes('cmdk') || id.includes('@radix-ui/react-dialog')) {
            return 'search-ui';
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
