import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  test: {
    coverage: {
      provider: 'v8'
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  },
  build: {
    outDir: 'build' // CRA's default build output
  }
})
