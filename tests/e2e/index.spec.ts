import { test, expect } from '@playwright/test';

test.describe('Index page', () => {
  test('renders hero content and demo interactions', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 1, name: /Build Faster with/i }),
    ).toBeVisible();
    await expect(
      page.getByText('Production-Ready MPA Template'),
    ).toBeVisible();

    const seeDemoButton = page.getByRole('button', { name: /See Live Demo/i });
    await expect(seeDemoButton).toBeVisible();
    await seeDemoButton.click();
    await expect(page.locator('#demo')).toBeVisible();

    const chartHelperText = page.getByText('Chart not loaded yet', { exact: false });
    await expect(chartHelperText).toBeVisible();

    const toggleChartButton = page.getByRole('button', {
      name: /Show Chart \(Lazy Load\)/i,
    });
    await toggleChartButton.click();

    await expect(page.getByRole('button', { name: /Hide Chart/i })).toBeVisible();
    await expect(chartHelperText).toBeHidden();

    const dashboardLink = page.getByRole('link', { name: 'Go to Dashboard →' });
    await expect(dashboardLink).toHaveAttribute('href', '/dashboard/');
  });
});

