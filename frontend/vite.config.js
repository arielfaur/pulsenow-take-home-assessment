import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const API_TARGET = env.VITE_API_TARGET || 'http://localhost:5000'

  console.log(`Using proxy API target: ${API_TARGET}`)

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
      globals: true,
      include: ['src/**/*.test.{js,jsx,ts,tsx}'],
      exclude: ['e2e/**', '**/e2e/**', 'node_modules/**'],
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: API_TARGET,
          changeOrigin: true
        }
      }
    }
  }
})
