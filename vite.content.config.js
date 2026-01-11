import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [
    react({ 
      // disables React dev helpers (Wr/He/pr stack traces)
      jsxDev: false 
    }),
    tsconfigPaths(),
    svgr(),
  ],

  define: {
    __REACT_DEVTOOLS_ATTACH__: false,
  },

  optimizeDeps: {
    include: ['@headlessui/react'],
  },

  build: {
    outDir: 'dist',
    emptyOutDir: false,
    target: 'es2017',

    // minification does a horrible job with the code of this project
    minify: false,

    rollupOptions: {
      input: path.resolve(__dirname, 'src/content/main.tsx'),
      output: {
        format: 'iife',        // single self-invoking function
        entryFileNames: 'content.js',
        inlineDynamicImports: true, // ensures single-file bundle
      },
    },
  },

  // treat CSS as text for injections
  esbuild: {
    loader: 'tsx',
  },
});
