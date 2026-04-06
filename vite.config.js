import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import Checker from 'vite-plugin-checker'
import path from 'path'
import svgr from 'vite-plugin-svgr'

import fs from 'fs'
import { execSync } from 'child_process'

export default defineConfig({
  target: 'es2018',
  minify: 'esbuild',
  sourcemap: false,

  plugins: [
    svgr(),

    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-constant-elements'],
          ['transform-react-remove-prop-types', { removeImport: true }],
        ],
      },
    }),

    tsconfigPaths(),
    Checker({ typescript: true }),

    {
      name: 'full-build-extension',

      closeBundle() {
        console.log('🔧 Running extra builds...')

        execSync(
          'vite build --mode production --config vite.content.config.js',
          { stdio: 'inherit' }
        )

        execSync(
          'vite build --config vite.background.config.js',
          { stdio: 'inherit' }
        )

        execSync(
          'node scripts/csp-fix.js',
          { stdio: 'inherit' }
        )

        console.log('📦 Creating Chrome zip...')

        try {
          fs.rmSync('lichess-puzzle-timer.zip')
        } catch {}

        execSync(
          'zip -r lichess-puzzle-timer.zip dist',
          { stdio: 'inherit' }
        )

        console.log('🦊 Creating Firefox build...')

        const firefoxDir = 'dist-firefox'

        fs.rmSync(firefoxDir, { recursive: true, force: true })
        fs.mkdirSync(firefoxDir, { recursive: true })
        fs.cpSync('dist', firefoxDir, { recursive: true })

        // ===== MODIFY MANIFEST =====
        const manifestPath = path.join(firefoxDir, 'manifest.json')
        const manifest = JSON.parse(
          fs.readFileSync(manifestPath, 'utf-8')
        )

        // 1. background: service_worker → scripts
        if (manifest.background?.service_worker) {
          manifest.background = {
            scripts: [manifest.background.service_worker],
          }
        }

        // 2. web_accessible_resources matches → <all_urls>
        if (manifest.web_accessible_resources) {
          manifest.web_accessible_resources =
            manifest.web_accessible_resources.map((res) => ({
              ...res,
              matches: ['<all_urls>'],
            }))
        }

        // 3. Firefox-specific settings
        manifest.browser_specific_settings = {
          gecko: {
            id: 'lichess-puzzle-timer@eltecson.dev',
            strict_min_version: '109.0',
            data_collection_permissions: {
              required: ['none'],
            },
          },
          gecko_android: {
            id: 'lichess-puzzle-timer@eltecson.dev',
            strict_min_version: '109.0',
            data_collection_permissions: {
              required: ['none'],
            },
          },
        }

        fs.writeFileSync(
          manifestPath,
          JSON.stringify(manifest, null, 2)
        )

        console.log('📦 Zipping Firefox build...')

        try {
          fs.rmSync('lichess-puzzle-timer-firefox.zip')
        } catch {}

        execSync(
          `cd ${firefoxDir} && zip -r ../lichess-puzzle-timer-firefox.zip .`,
          { stdio: 'inherit' }
        )

        fs.rmSync(firefoxDir, { recursive: true, force: true })

        console.log('✅ Done! Chrome + Firefox zips created.')
      },
    },
  ],

  define: {
    'process.env.NODE_ENV': '"production"',
  },

  build: {
    outDir: 'dist',

    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        local: resolve(__dirname, 'local.html'),
      },

      output: {
        entryFileNames: (assetInfo) => {
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