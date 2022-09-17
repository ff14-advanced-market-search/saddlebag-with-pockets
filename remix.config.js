const { withEsbuildOverride } = require('remix-esbuild-override')

withEsbuildOverride((option, { isServer, isDev }) => {
  // update the option
  option.logOverride = { 'this-is-undefined-in-esm': 'silent' }

  return option
})
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'cloudflare-pages',
  server: './server.js',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*']
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
}
