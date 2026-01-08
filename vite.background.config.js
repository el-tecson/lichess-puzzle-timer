import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  target: 'es2018',
  minify: 'esbuild',
  sourcemap: false,
  plugins: [react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-constant-elements'],
          ['transform-react-remove-prop-types', { removeImport: true }],
        ],
      },
    }), tsconfigPaths()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/background/background.ts'),
      output: {
        entryFileNames: 'background.js',
        format: 'iife', // must be string
      },
    },
    target: 'es2018',
  },
})