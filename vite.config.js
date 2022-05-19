import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  server: {
    port: 4000,
    strictPort: true
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'GALC',
      filename: (fmt) => `galc.${fmt}.js`
    },
    minify: false,
    sourcemap: true
  },
  plugins: [vue()]
})
