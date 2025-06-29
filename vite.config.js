import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/basic-colorpicker/",
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: true,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Color Picker',
      short_name: 'Color Picker',
      description: 'Just a basic color picker PWA.',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})