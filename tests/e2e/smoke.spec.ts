import { test, expect } from '@playwright/test'

const ROUTES = ['/', '/profil-tim', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/kegiatan', '/cerita', '/umkm', '/mitra']

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
  await expect(interaktifTab).toBeVisible({ timeout: 15000 })
  await page.getByRole('tab', { name: 'Peta GIS Tim' }).click()
  await expect(page.getByText(/Peta GIS/i).first()).toBeVisible({ timeout: 10000 })
})

test('admin loads (production static serve)', async ({ page }) => {
  // In `next dev`, App Router intercepts /admin before public/ files are served,
  // so this test only passes against the static export (`out/`) or on Vercel.
  // We skip it when the dev server returns the Next.js app shell instead.
  test.skip(process.env.CI === undefined && !process.env.PLAYWRIGHT_SERVE_STATIC, 'admin requires static export serve; dev server intercepts /admin')
  await page.goto('/admin/')
  await expect(page).toHaveTitle(/Content Manager/i)
})