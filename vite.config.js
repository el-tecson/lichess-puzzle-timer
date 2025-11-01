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
        local: resolve(__dirname, 'local.html'),
        "content/loadCustoms": resolve(__dirname, 'src/content/loadCustoms.tsx'),
      },
      output: {
        entryFileNames: assetInfo => {
          // keeps separate folders for background/content/popup
          if (assetInfo.name.includes('background')) return '[name].js'
          if (assetInfo.name.includes('content')) return '[name].js'
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