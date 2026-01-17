import './polyfills'
import type { EntryContext } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { RemixServer } from '@remix-run/react'
import { renderToReadableStream } from 'react-dom/server.browser'
import { redirectOnPath } from './utils/redirectOnPath'

const ABORT_DELAY = 5_000

/**
 * Processes an incoming request and generates an appropriate HTML response.
 * @example
 * handleRequest(sampleRequest, 200, sampleHeaders, sampleRemixContext)
 * // Response object containing HTML document string.
 * @param {Request} request - The incoming HTTP request object to process.
 * @param {number} responseStatusCode - The HTTP status code to use for the response.
 * @param {Headers} responseHeaders - Headers to set on the HTTP response.
 * @param {EntryContext} remixContext - Context object used for rendering the Remix application.
 * @returns {Response} An HTTP Response object containing the HTML output.
 * @description
 *   - Automatically redirects the request if a specific path condition is met.
 *   - The Content-Type header of response is set to 'text/html'.
 *   - Utilizes Remix server-side rendering capability for the generated markup.
 */
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

  responseHeaders.set('Content-Type', 'text/html')

  return renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        responseStatusCode = 500
        console.error(error)
      }
    }
  ).then(async (stream) => {
    // Ensure shell is ready before responding
    if (stream.allReady) {
      await stream.allReady
    }

    return new Response(stream, {
      status: responseStatusCode,
      headers: responseHeaders
    })
  })
}
