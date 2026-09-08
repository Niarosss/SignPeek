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
    {
      name: 'inject-manrope-preload',
      apply: 'build',
      transformIndexHtml(html, ctx) {
        if (!ctx.bundle) return html;
        const cyrillicFont = Object.keys(ctx.bundle).find(
          (name) => name.includes('manrope-cyrillic') && name.endsWith('.woff2')
        );
        const latinFont = Object.keys(ctx.bundle).find(
          (name) => name.includes('manrope-latin') && name.endsWith('.woff2')
        );

        const preloadLinks = [
          cyrillicFont && `<link rel="preload" href="/${cyrillicFont}" as="font" type="font/woff2" crossorigin="anonymous">`,
          latinFont && `<link rel="preload" href="/${latinFont}" as="font" type="font/woff2" crossorigin="anonymous">`,
        ]
          .filter(Boolean)
          .join('\n  ');

        if (!preloadLinks) return html;

        return html.replace('</head>', `  ${preloadLinks}\n</head>`);
      },
    },
  ],

  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
  },

  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 2000,
  },
})