import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { writeBuildMetadata } from './scripts/datadog-build.cjs'

writeBuildMetadata()

export default defineConfig({
  plugins: [tsconfigPaths()]
})
