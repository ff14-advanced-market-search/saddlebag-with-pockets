import { Outlet } from '@remix-run/react'
import ErrorBounds from '~/components/utilities/ErrorBoundary'

export function ErrorBoundary() {
  return <ErrorBounds />
}

export default function Index() {
  return <Outlet />
}
