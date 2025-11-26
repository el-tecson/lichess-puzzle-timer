import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/content/main.tsx'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife', // must be string
      },
    },
    target: 'esnext',
  },
})