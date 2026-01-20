import { test, expect } from '@playwright/test'

test('theme toggle and navigation smoke test', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  const themeToggle = page.getByLabel('Toggle theme')
  await expect(themeToggle).toBeVisible()
  await themeToggle.click()

  await page.getByRole('link', { name: 'Assets' }).click()
  await expect(page).toHaveURL(/\/assets/)
  await expect(page.getByRole('heading', { name: 'Assets' })).toBeVisible()
})
