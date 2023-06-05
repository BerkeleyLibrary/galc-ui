import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      // all: true, // TODO: enable this, test components
      provider: 'istanbul',
      reporter: ['text', 'html'],
      reportsDirectory: './artifacts/coverage',
      src: ['src'],
      lines: 100,
      branches: 100
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
