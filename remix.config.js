const { withEsbuildOverride } = require('remix-esbuild-override')

withEsbuildOverride((option) => {
  if (
    option.entryPoints &&
    Array.isArray(option.entryPoints) &&
    option.entryPoints.includes('./server.ts')
  ) {
    if (!option.external) {
      option.external = ['__STATIC_CONTENT_MANIFEST']
    }
  }
  return option
})

/** @type {import("@remix-run/dev").AppConfig} */
module.exports = {
  serverBuildTarget: 'cloudflare-workers',
  server: './server.ts',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
  assetsBuildDirectory: 'public/build'
}
