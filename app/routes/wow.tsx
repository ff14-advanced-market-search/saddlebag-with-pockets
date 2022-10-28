import type { ErrorBoundaryComponent } from '@remix-run/cloudflare'
import { Outlet } from '@remix-run/react'

export default function Wow() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <>
      <p>Erg! Something's broken! Maybe try again. </p>
      <pre>{error.message}</pre>
    </>
  )
}
