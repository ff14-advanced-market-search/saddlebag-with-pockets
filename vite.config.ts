import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy
} from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    // Only use dev proxy in development mode
    ...(process.env.NODE_ENV === 'development'
      ? [remixCloudflareDevProxy()]
      : []),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true
      }
    }),
    tsconfigPaths()
  ],
  ssr: {
    external: ['react', 'react-dom']
  },
  build: {
    rollupOptions: {
      external: /\.css$/
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
