import { test, expect } from '@playwright/test';
import fs from 'fs';

test.setTimeout(80000);

test('Search "plier" and compare screenshots before and after multiple clicks', async ({ page }) => {
  await page.goto('https://with-bugs.practicesoftwaretesting.com/#/');
  await page.waitForSelector('[data-test="search-query"]');

  const searchBox = page.locator('[data-test="search-query"]');
  const searchButton = page.locator('[data-test="search-submit"]');

  await searchBox.fill('plier');
  await searchButton.click();

  // Wait a bit for the search results to load
  await page.waitForTimeout(5000);

  if (!fs.existsSync('visuals')) fs.mkdirSync('visuals');

  // Take first screenshot after initial search
  const firstScreenshot = await page.screenshot({ path: 'visuals/first-search.png', fullPage: true });

  // Randomize the number of extra clicks (between 1 and 5)
  const extraClicks = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < extraClicks; i++) {
    await searchButton.click();
    await page.waitForTimeout(1000);
  }

  // Take screenshot after multiple clicks
  const afterClicksScreenshot = await page.screenshot({ path: 'visuals/after-multiple-clicks.png', fullPage: true });

  // Compare screenshots using Playwright's snapshot feature
  expect(afterClicksScreenshot).toMatchSnapshot('after-multiple-clicks-compare.png');
  expect(firstScreenshot).toMatchSnapshot('first-search-compare.png');
});