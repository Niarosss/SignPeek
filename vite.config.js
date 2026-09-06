import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', {}]],
      },
    }),

    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      manifest: false,
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,bcmap,properties}'],
      },
    }),
  ],

  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
  },

  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
    modulePreload: false,

    rollupOptions: {
      output: {
        codeSplitting: {
          minSize: 10000,
          groups: [
            {
              name: 'vendor-pdfjs',
              test: /[\\/]node_modules[\\/]pdfjs-dist/,
              priority: 110,
            },
            {
              name: 'vendor-crypto',
              test: /[\\/]node_modules[\\/](pkijs|asn1js)/,
              priority: 100,
            },
            {
              name: 'vendor-viewers',
              test: /[\\/]node_modules[\\/](react-pdf|docx-preview|xlsx)/,
              priority: 90,
            },
            {
              name: 'vendor-icons',
              test: /[\\/]node_modules[\\/]@phosphor-icons/,
              priority: 80,
            },
            {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})