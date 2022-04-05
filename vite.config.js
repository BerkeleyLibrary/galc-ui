import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true
  },
  plugins: [vue()]
})
