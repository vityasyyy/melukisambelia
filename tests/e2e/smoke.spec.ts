import { test, expect } from '@playwright/test'

const ROUTES = ['/', '/profil-tim', '/peta', '/pariwisata', '/irigasi', '/kesehatan', '/festival', '/kegiatan', '/cerita', '/umkm', '/mitra']

for (const route of ROUTES) {
  test(`loads ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })
}

test('peta tabs switch', async ({ page }) => {
  await page.goto('/peta')
  await expect(page.getByRole('tab', { name: 'Peta Interaktif' })).toBeVisible()
  await page.getByRole('tab', { name: 'Peta GIS Tim' }).click()
  await expect(page.getByText(/Peta GIS/i)).toBeVisible()
})

test('admin loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveTitle(/Content Manager/i)
})