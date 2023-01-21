import type { EntryContext } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'

type RedirectOnPath = { redirect: false } | { redirect: true; path: string }
const redirectOnPath = (path: string): RedirectOnPath => {
  switch (path) {
    case '/queries/commodity-scan':
    case '/queries/commodity-scan/':
      return {
        redirect: true,
        path: '/queries/full-scan?minimumStackSize=2&minimumProfitAmount=1000&pricePerUnit=1000'
      }
    default:
      return { redirect: false }
  }
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  const url = new URL(request.url)

  const shouldRedirect = redirectOnPath(url.pathname)
  if (shouldRedirect.redirect) {
    return redirect(shouldRedirect.path)
  }

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  })
}
