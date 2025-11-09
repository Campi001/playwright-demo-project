import { test, expect, Page } from '@playwright/test';

test.describe('Login flow', () => {
  const login = async (page: Page, username: string, password: string) => {
    await page.goto('/');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
  };

  test('logs in successfully with demo/demo123', async ({ page }) => {
    await login(page, 'demo', 'demo123');

    await expect(page.getByRole('status')).toHaveText(/welcome,\s*demo/i);
  });

  test('shows an error for invalid credentials', async ({ page }) => {
    await login(page, 'demo', 'wrong-password');

    const alert = page.getByRole('alert');
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText(/invalid credentials/i);
  });
});
