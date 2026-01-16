import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  ssr: {
    external: [
      'react-dnd',
      'react-dnd-html5-backend',
      'react-dnd-touch-backend',
      'react-dnd-scrolling',
      'raf'
    ]
  },
  test: {
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', 'build', 'app/e2e/**', '**/*-links.test.ts']
  }
})
