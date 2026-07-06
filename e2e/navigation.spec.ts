import { test, expect } from '@playwright/test';

test.describe('Navigation & Basic Flow', () => {
  test('homepage has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home \| Boutique Fashion/);
  });

  test('can navigate to category and product', async ({ page }) => {
    await page.goto('/');
    
    // Click on a category in the header (e.g. Bridal)
    await page.getByRole('link', { name: 'Bridal', exact: true }).first().click();
    await expect(page).toHaveURL(/.*bridal/);
    await expect(page).toHaveTitle(/Bridal/);

    // Go to dress category
    await page.getByRole('link', { name: 'Dresses', exact: true }).first().click();
    await expect(page).toHaveURL(/.*dress/);
  });
});
