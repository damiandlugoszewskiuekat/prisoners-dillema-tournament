import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [vue(), dynamicImportVars({
    include: ['/**/*.svg'],
  })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: 'happy-dom',
  },
});
