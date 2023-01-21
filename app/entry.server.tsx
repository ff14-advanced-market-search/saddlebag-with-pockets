import type { EntryContext } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'
import { redirectOnPath } from './utils/redirectOnPath'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const url = new URL(request.url)

  const shouldRedirect = redirectOnPath(url.pathname)
  if (shouldRedirect.redirect) {
    return redirect(shouldRedirect.path)
  }

  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}
