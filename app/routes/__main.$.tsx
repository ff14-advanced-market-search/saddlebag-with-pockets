import { Links, Meta, Outlet } from '@remix-run/react'
import ErrorBounds from '~/components/utilities/ErrorBoundary'
import {
  EnsureThemeApplied,
  ThemeProvider
} from '~/utils/providers/theme-provider'

export const ErrorBoundary = () => (
  <ThemeProvider>
    <html>
      <head>
        <Meta />
        <Links />
        <EnsureThemeApplied />
      </head>
      <body>
        <ErrorBounds />
      </body>
    </html>
  </ThemeProvider>
)

export default function Index() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  )
}
