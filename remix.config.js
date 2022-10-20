const { withEsbuildOverride } = require('remix-esbuild-override')

withEsbuildOverride((option) => {
  option.external = ['__STATIC_CONTENT_MANIFEST'];
  option.logLevel = "error";
  option.logOverride = {"this-is-undefined-in-esm":"silent"}
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
