import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Checker from 'vite-plugin-checker'
import path from 'path'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    tsconfigPaths(),
    Checker({ typescript: true }),
],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
      },
      output: {
        entryFileNames: assetInfo => {
          // keeps separate folders for background/content/popup
          if (assetInfo.name.includes('background')) return 'background/[name].js'
          if (assetInfo.name.includes('content')) return 'content/[name].js'
          return 'assets/[name].js'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})