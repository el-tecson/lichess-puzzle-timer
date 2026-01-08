import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    react(), tsconfigPaths(), svgr(),
  ],

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: false,
    target: 'es2018',
    minify: 'esbuild',

    rollupOptions: {
      input: path.resolve(__dirname, 'src/content/main.tsx'),
      output: {
        format: 'iife',
        entryFileNames: 'content.js',
      },
    },
  },
})