import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: false, 
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, 
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    })
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
  },
  optimizeDeps: {
    include: ['jszip', 'docx-preview'],
  },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    commonjsOptions: {
      include: [/jszip/, /docx-preview/],
    },
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
  }
})