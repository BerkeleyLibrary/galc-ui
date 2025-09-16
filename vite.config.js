import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')
const fs = require('fs')

function stripDevCSS () {
  return {
    name: 'strip-dev-css',
    resolveId (source) {
      return source === 'virtual-module' ? source : null
    },
    renderStart (outputOptions, _inputOptions) {
      const outDir = outputOptions.dir
      const cssDir = path.resolve(outDir, 'css')
      fs.rm(cssDir, { recursive: true }, () => console.log(`Deleted ${cssDir}`))
    }
  }
}

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
    rollupOptions: {
      external: (id) => id.startsWith('/css/')
    },
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [vue(), stripDevCSS()],
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
  }
})
