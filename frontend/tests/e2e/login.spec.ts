import { test, expect } from '@playwright/test';

test.describe('Authentication and Portal Navigation E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the local dev port
    await page.goto('http://localhost:3000/');
  });

  test('should display the marketing portal with correct headers', async ({ page }) => {
    await expect(page).toHaveTitle(/SynapseAI/);
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('Enterprise AI');
  });

  test('should allow employees to open portal modal and submit login', async ({ page }) => {
    // Click Employee Portal button
    const employeePortalButton = page.locator('button:has-text("Employee Portal")');
    await expect(employeePortalButton).toBeVisible();
    await employeePortalButton.click();

    // Verify modal elements are visible
    const loginModal = page.locator('h3:has-text("Sign in to your Workspace")');
    await expect(loginModal).toBeVisible();

    // Fill credentials and click Enter
    await page.fill('input[type="email"]', 'marcus.vance@synapse.ai');
    await page.click('button:has-text("Authorize Session")');

    // Should transition to internal workspace dashboard
    const mainWorkspaceNode = page.locator('span:has-text("Enterprise Neural Node Live")');
    await expect(mainWorkspaceNode).toBeVisible();
  });
});
