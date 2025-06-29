import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],           // only emit ESM
      fileName: () => 'index.js' // output exactly "index.js"
    },
    rollupOptions: {
      output: {
        exports: 'named'         // ensure named exports are preserved
      }
    }
  }
});

