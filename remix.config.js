/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'cloudflare-pages',
  serverModuleFormat: 'esm',
  serverPlatform: 'neutral',
  serverConditions: ['workerd', 'worker', 'browser', 'default'],
  serverMainFields: ['browser', 'module', 'main'],
  server: './server.js',
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ['**/.*'],
  future: {
    v3_fetcherPersist: true,
    v3_lazyRouteDiscovery: true,
    v3_relativeSplatPath: true,
    v3_singleFetch: true,
    v3_throwAbortReason: true
  }
}
