import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

export async function loader({ context }: LoaderFunctionArgs) {
  const hasProcessEnv = !!(
    (globalThis as any).process && (globalThis as any).process.env
  )
  const nodeCompatFlag = Array.isArray(
    (context as any).env?.COMPATIBILITY_FLAGS
  )
    ? (context as any).env?.COMPATIBILITY_FLAGS.includes('nodejs_compat')
    : undefined

  return json({ ok: true, hasProcessEnv, nodeCompatFlag })
}

export default function Proof() {
  const data = useLoaderData<typeof loader>()
  return (
    <div style={{ padding: 16 }}>
      <h1>Runtime Proof</h1>
      <p>Remix SSR: ok</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
