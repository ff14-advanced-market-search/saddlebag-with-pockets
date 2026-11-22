declare module '*datadog-build.json' {
  const metadata: {
    service: string
    version: string
    env: string
  }
  export default metadata
}
