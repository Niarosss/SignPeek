import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
  },
  optimizeDeps: {
    include: ['jszip', 'docx-preview'],
  },
  build: {
    commonjsOptions: {
      include: [/jszip/, /docx-preview/],
    },
  },
})