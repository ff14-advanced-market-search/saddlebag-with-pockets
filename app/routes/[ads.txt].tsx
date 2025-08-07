import type { LoaderFunction } from '@remix-run/cloudflare'

export const loader: LoaderFunction = () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: 'https://powerad.ai/261066107350250/ads.txt'
    }
  })
}
