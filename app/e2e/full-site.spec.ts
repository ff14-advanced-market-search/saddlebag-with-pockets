import { test, expect } from '@playwright/test'

test.describe('Full Site E2E', () => {
  test.describe('Landing Pages', () => {
    test('should load home page without errors', async ({ page }) => {
      await page.goto('/')
      expect(page.url()).toContain('localhost')
      // Check for no error boundaries
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
      // Verify main content loads
      expect(await page.locator('text=Saddlebag').count()).toBeGreaterThan(0)
    })

    test('should load FFXIV landing page', async ({ page }) => {
      await page.goto('/ffxiv')
      expect(page.url()).toContain('/ffxiv')
      expect(
        await page.locator('text=FFXIV Market Board Tools').count()
      ).toBeGreaterThan(0)
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load WoW landing page', async ({ page }) => {
      await page.goto('/wow')
      expect(page.url()).toContain('/wow')
      expect(
        await page.locator('text=Azeroth Auction Assassin').count()
      ).toBeGreaterThan(0)
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load GW2 landing page', async ({ page }) => {
      await page.goto('/gw2')
      expect(page.url()).toContain('/gw2')
      expect(await page.locator('text=Guild Wars 2').count()).toBeGreaterThan(0)
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load blog page', async ({ page }) => {
      await page.goto('/blog')
      expect(page.url()).toContain('/blog')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Sidebar Navigation', () => {
    test('should toggle FFXIV accordion and navigate', async ({ page }) => {
      await page.goto('/')
      const ffxivButton = page.locator('button:has-text("Final Fantasy XIV")')
      await expect(ffxivButton).toBeVisible()
      await ffxivButton.first().click()

      const bestDealsLink = page.locator(
        'a[data-discover][href*="ffxiv/best-deals"]'
      )
      await expect(bestDealsLink.first()).toBeVisible()

      await Promise.all([
        page.waitForURL('**/ffxiv/best-deals**'),
        bestDealsLink.first().click()
      ])

      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should toggle WoW accordion and navigate', async ({ page }) => {
      await page.goto('/')
      const wowButton = page
        .locator('button:has-text("World of Warcraft")')
        .first()
      await expect(wowButton).toBeVisible()
      await wowButton.click()

      const bestDealsLink = page.locator(
        'a[data-discover][href*="wow/best-deals"]'
      )
      await expect(bestDealsLink.first()).toBeVisible()

      await Promise.all([
        page.waitForURL('**/wow/best-deals**'),
        bestDealsLink.first().click()
      ])

      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should toggle GW2 accordion and navigate', async ({ page }) => {
      await page.goto('/')
      const gw2Button = page.locator('button:has-text("Guild Wars 2")').first()
      await expect(gw2Button).toBeVisible()
      await gw2Button.click()

      const marketshareLink = page.locator('a[href*="gw2/marketshare"]')
      await expect(marketshareLink).toBeVisible()

      await Promise.all([
        page.waitForURL('**/gw2/marketshare**'),
        marketshareLink.first().click()
      ])

      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should toggle experimental tools accordion', async ({ page }) => {
      await page.goto('/')
      const expButton = page
        .locator('button:has-text("WoW Experimental Tools")')
        .first()
      await expect(expButton).toBeVisible()
      await expButton.click()

      const queueLink = page
        .locator('a:has-text("Weekly Price Group Delta")')
        .first()
      await expect(queueLink).toBeVisible()
    })
  })

  test.describe('Feature Pages - FFXIV', () => {
    test('should load marketshare overview', async ({ page }) => {
      await page.goto('/ffxiv/marketshare/queries')
      expect(page.url()).toContain('/ffxiv/marketshare')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load craftsim queries', async ({ page }) => {
      await page.goto('/ffxiv/craftsim/queries')
      expect(page.url()).toContain('/ffxiv/craftsim')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load extended history', async ({ page }) => {
      await page.goto('/ffxiv/extended-history')
      expect(page.url()).toContain('/ffxiv/extended-history')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load shopping list', async ({ page }) => {
      await page.goto('/ffxiv/shopping-list')
      expect(page.url()).toContain('/ffxiv/shopping-list')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Feature Pages - WoW', () => {
    test('should load best deals recommended', async ({ page }) => {
      await page.goto('/wow/best-deals/recommended')
      expect(page.url()).toContain('/wow/best-deals')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load marketshare overview', async ({ page }) => {
      await page.goto('/wow/marketshare/recommended')
      expect(page.url()).toContain('/wow/marketshare')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load shopping list', async ({ page }) => {
      await page.goto('/wow/shopping-list')
      expect(page.url()).toContain('/wow/shopping-list')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load price alert', async ({ page }) => {
      await page.goto('/wow/price-alert')
      expect(page.url()).toContain('/wow/price-alert')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load upload timers', async ({ page }) => {
      await page.goto('/wow/upload-timers')
      expect(page.url()).toContain('/wow/upload-timers')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Feature Pages - GW2', () => {
    test('should load marketshare overview', async ({ page }) => {
      await page.goto('/gw2/marketshare/recommended')
      expect(page.url()).toContain('/gw2/marketshare')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load weekly price delta recommended', async ({ page }) => {
      await page.goto('/gw2/weekly-price-group-delta-recommended')
      expect(page.url()).toContain('/gw2/weekly-price-group-delta')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Cross-Game Queries', () => {
    test('should load reselling trades', async ({ page }) => {
      await page.goto('/queries/recommended')
      expect(page.url()).toContain('/queries')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load world comparison', async ({ page }) => {
      await page.goto('/queries/world-comparison')
      expect(page.url()).toContain('/queries')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load item history', async ({ page }) => {
      await page.goto('/queries/item-history')
      expect(page.url()).toContain('/queries')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Special Features', () => {
    test('should load allagan data reports', async ({ page }) => {
      await page.goto('/allagan-data')
      expect(page.url()).toContain('/allagan-data')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load undercut alerts generator', async ({ page }) => {
      await page.goto('/undercut')
      expect(page.url()).toContain('/undercut')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load price sniper alerts generator', async ({ page }) => {
      await page.goto('/price-sniper')
      expect(page.url()).toContain('/price-sniper')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Item Lists', () => {
    test('should load WoW item list', async ({ page }) => {
      await page.goto('/wow/itemlist')
      expect(page.url()).toContain('/wow/itemlist')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load FFXIV item list', async ({ page }) => {
      await page.goto('/ffxiv/itemlist')
      expect(page.url()).toContain('/ffxiv/itemlist')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })

    test('should load GW2 item list', async ({ page }) => {
      await page.goto('/gw2/itemlist')
      expect(page.url()).toContain('/gw2/itemlist')
      expect(await page.locator('text=Unexpected Server Error').count()).toBe(0)
    })
  })

  test.describe('Error Handling', () => {
    test('should handle 404 gracefully', async ({ page }) => {
      const response = await page.goto('/nonexistent-route-12345')
      expect(response?.status()).toBe(404)
    })

    test('should not show server errors on main pages', async ({ page }) => {
      const routes = [
        '/',
        '/ffxiv',
        '/wow',
        '/gw2',
        '/blog',
        '/queries/recommended'
      ]

      for (const route of routes) {
        await page.goto(route)
        const errorCount = await page
          .locator('text=Unexpected Server Error')
          .count()
        expect(errorCount, `Route ${route} should not have server errors`).toBe(
          0
        )
      }
    })
  })

  test.describe('Sidebar Icons & Interactions', () => {
    test('should render sidebar icons without errors', async ({ page }) => {
      await page.goto('/')
      // Check that sidebar is visible
      expect(
        await page.locator('[aria-hidden="true"]').count()
      ).toBeGreaterThan(0)
      // Verify no console errors about missing icons
      expect(await page.locator('text=is not defined').count()).toBe(0)
    })

    test('should toggle sidebar on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')

      const openSidebar = page.getByRole('button', { name: /open sidebar/i })
      await expect(openSidebar).toBeVisible()
      await openSidebar.click()

      await expect(page.locator('nav').first()).toBeVisible()
    })
  })

  test.describe('Navigation Flow', () => {
    test('should navigate back and forth', async ({ page }) => {
      await page.goto('/')
      await page.goto('/ffxiv')
      await page.waitForURL('**/ffxiv**')
      expect(page.url()).toContain('/ffxiv')

      await page.goBack({ waitUntil: 'load' })
      await page.waitForURL('**/')
      expect(page.url()).not.toContain('/ffxiv')

      await page.goForward({ waitUntil: 'load' })
      await page.waitForURL('**/ffxiv**')
      expect(page.url()).toContain('/ffxiv')
    })

    test('should load pages quickly', async ({ page }) => {
      const routes = [
        '/ffxiv/best-deals/recommended',
        '/wow/marketshare/recommended',
        '/gw2/marketshare/recommended'
      ]

      for (const route of routes) {
        const startTime = Date.now()
        await page.goto(route)
        const loadTime = Date.now() - startTime
        // Page should load within 10 seconds
        expect(loadTime).toBeLessThan(10000)
      }
    })
  })
})
