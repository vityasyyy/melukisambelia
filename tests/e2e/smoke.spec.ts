import { test, expect } from '@playwright/test'

const ROUTES = ['/', '/tentang-sambelia', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/cerita', '/umkm']

for (const route of ROUTES) {
  test(`loads ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
}

test('peta tabs switch', async ({ page }) => {
  await page.goto('/peta')
  const interaktifTab = page.getByRole('tab', { name: 'Peta Interaktif' })
  await expect(interaktifTab).toBeVisible({ timeout: 30000 })
  await page.getByRole('tab', { name: 'GIS Tim' }).click()
  await expect(page.getByText(/Peta GIS Tim Melukis Sambelia/i).first()).toBeVisible({ timeout: 10000 })
})

test('admin loads (production static serve)', async ({ page }) => {
  // In `next dev`, App Router intercepts /admin before public/ files are served,
  // so this test only passes against the static export (`out/`) or on Vercel.
  // We skip it when the dev server returns the Next.js app shell instead.
  test.skip(process.env.CI === undefined && !process.env.PLAYWRIGHT_SERVE_STATIC, 'admin requires static export serve; dev server intercepts /admin')
  await page.goto('/admin/')
  await expect(page).toHaveTitle(/Content Manager/i)
})

test('mobile nav menu opens and closes', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } })
  const page = await context.newPage()
  await page.goto('/')
  // Hamburger button should be visible on mobile
  const menuButton = page.getByRole('button', { name: 'Buka menu' })
  await expect(menuButton).toBeVisible()
  await menuButton.click()
  // Close button should appear
  await expect(page.getByRole('button', { name: 'Tutup menu' })).toBeVisible()
  // Click the Peta link inside the mobile menu
  const mobilePetaLink = page.locator('#mobile-menu >> a[href="/peta"]')
  await expect(mobilePetaLink).toBeVisible()
  await mobilePetaLink.click()
  await expect(page).toHaveURL(/\/peta/)
  await context.close()
})

test('mobile hero renders without horizontal scroll', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } })
  const page = await context.newPage()
  await page.goto('/')
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  expect(scrollWidth).toBeLessThanOrEqual(375)
  await context.close()
})