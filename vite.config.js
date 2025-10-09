import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Checker from 'vite-plugin-checker'

export default defineConfig({
  plugins: [
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
})