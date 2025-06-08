import { createPagesFunctionHandler } from '@react-router/cloudflare-pages'
import * as build from '@react-router/dev/server-build'

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => context.env
})

export function onRequest(context) {
  return handleRequest(context)
}
