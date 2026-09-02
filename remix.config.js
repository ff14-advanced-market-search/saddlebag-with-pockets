/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  server: './server.js',
  serverBuildPath: 'functions/[[path]].js',
  serverConditions: ['worker'],
  serverDependenciesToBundle: 'all',
  serverMainFields: ['browser', 'module', 'main'],
  serverMinify: true,
  serverModuleFormat: 'esm',
  serverNodeBuiltinsPolyfill: { modules: {} },
  serverPlatform: 'neutral',
  ignoredRouteFiles: ['**/.*'],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  // Keep Single Fetch disabled until the app migrates to React Router versions
  // that include the patched turbo-stream serialization implementation.
  future: {}
}
