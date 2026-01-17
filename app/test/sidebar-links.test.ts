import { describe, it, expect } from 'vitest'
import { navGroups } from '../components/navigation/sidebar/Sidebar'

// Simple smoke test to hit every non-external sidebar link and ensure it does not 500.
describe('sidebar links', () => {
  const baseUrl = process.env.SBX_BASE_URL ?? 'http://localhost:8788'

  const paths = Array.from(
    new Set(
      navGroups
        .flatMap((group) => group.links)
        .filter((link) => !link.external)
        .map((link) =>
          link.href.startsWith('/') ? link.href : `/${link.href}`
        )
    )
  )

  paths.forEach((path) => {
    it(`responds for ${path}`, async () => {
      const res = await fetch(`${baseUrl}${path}`)
      expect(res.status).toBeLessThan(500)
    })
  })
})
