import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const CORE_ROUTES = ['/', '/resume', '/identity', '/versions/'] as const;

test.describe('Portfolio V6 — E2E & WCAG 2.1 AA Suite', () => {
  for (const route of CORE_ROUTES) {
    test(`WCAG 2.1 AA (dark & light) + 0 console error on ${route}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (err) => {
        pageErrors.push(err.message);
      });

      await page.emulateMedia({ reducedMotion: 'reduce' });
      const response = await page.goto(route, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);

      // Disable CSS transitions/animations so axe measures final settled colors
      await page.addStyleTag({
        content:
          '*, *::before, *::after { transition: none !important; animation: none !important; } .reveal-item, [data-aos] { opacity: 1 !important; transform: none !important; }'
      });

      // 1. Dark theme WCAG 2.1 AA audit
      const darkAxe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        darkAxe.violations,
        `WCAG dark mode violations on ${route}: ${JSON.stringify(
          darkAxe.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))
        )}`
      ).toEqual([]);

      // 2. Switch to Light theme and run WCAG 2.1 AA audit
      await page.evaluate(() => {
        document.documentElement.classList.add('light-mode');
        document.body.classList.add('light-mode');
        const iframe = document.querySelector<HTMLIFrameElement>('#studioIframe');
        if (iframe?.contentDocument) {
          iframe.contentDocument.documentElement.classList.add('light-mode');
          iframe.contentDocument.body?.classList.add('light-mode');
        }
      });

      const lightAxe = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(
        lightAxe.violations,
        `WCAG light mode violations on ${route}: ${JSON.stringify(
          lightAxe.violations.map((v) => ({ id: v.id, nodes: v.nodes.length }))
        )}`
      ).toEqual([]);

      expect(consoleErrors).toEqual([]);
      expect(pageErrors).toEqual([]);
    });
  }

  test('Portfolio loads static GitHub catalog (0 api.github.com calls), filters by tech & search, and opens Case Study modal', async ({
    page
  }) => {
    const githubApiCalls: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('api.github.com')) {
        githubApiCalls.push(req.url());
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    expect(githubApiCalls).toEqual([]);

    // All (59) filter should display total count >= 59
    const allFilterBtn = page.locator('#filters button[data-filter="*"]');
    await expect(allFilterBtn).toContainText('59');

    // Filter by PowerShell tech tag -> 4 projects
    const psTagBtn = page.locator('#portfolioTechTags button[data-tech-tag="PowerShell"]');
    await psTagBtn.click();
    await expect(psTagBtn).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#portfolioGrid .portfolio-item:not(.d-none)')).toHaveCount(4);

    // Search for "CompareTools" -> 1 project
    const searchInput = page.locator('#portfolioSearchInput');
    await searchInput.fill('CompareTools');
    await expect(page.locator('#portfolioGrid .portfolio-item:not(.d-none)')).toHaveCount(1);

    // Reset filters -> back to paginated 5 cards
    await page.locator('#portfolioSearchClear').click();
    await page.locator('#portfolioTechTags button[data-tech-tag="*"]').click();
    await expect(page.locator('#portfolioGrid .portfolio-item:not(.d-none)')).toHaveCount(5);

    // Open HubAI Case Study modal
    const hubAiCsBtn = page.locator('button[data-case-study="HubAI"]').first();
    await hubAiCsBtn.click();
    const csDialog = page.locator('#caseStudyDialog');
    await expect(csDialog).toBeVisible();
    await expect(page.locator('#caseStudyDialogTitle')).toContainText('HubAI');
    await expect(csDialog.locator('.cs-card')).toHaveCount(4);

    // Close Case Study modal
    await csDialog.locator('[data-close-dialog]').click();
    await expect(csDialog).toBeHidden();
  });

  test('Command Palette (Ctrl+K) filters commands, closes on single Escape, and i18n switches FR <-> EN live', async ({
    page
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Open Command Palette via header trigger button
    await page.locator('#cmdPaletteTriggerBtn').click();
    const cmdDialog = page.locator('#cmdPaletteDialog');
    await expect(cmdDialog).toBeVisible();
    await expect(page.locator('#cmdPaletteList .ob-cmd-item')).toHaveCount(14);

    // Type query and verify single Escape closes the dialog immediately
    const cmdInput = page.locator('#cmdPaletteInput');
    await cmdInput.fill('CompareTools');
    await expect(page.locator('#cmdPaletteList .ob-cmd-item')).toHaveCount(1);
    await cmdInput.press('Escape');
    await expect(cmdDialog).toBeHidden();

    // Live language toggle FR -> EN
    await page.locator('#langSwitcherBtn').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page).toHaveTitle(/Full-Stack Developer, AI & IT Technician/i);
  });

  test('Interactive Resume (/resume) hides navigation & background canvas in print media mode', async ({
    page
  }) => {
    await page.goto('/resume', { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });

    const headerDisplay = await page
      .locator('#header')
      .evaluate((el) => getComputedStyle(el).display);
    const sheetDisplay = await page
      .locator('.resume-pages:not([hidden])')
      .first()
      .evaluate((el) => getComputedStyle(el).display);

    expect(headerDisplay).toBe('none');
    expect(sheetDisplay).not.toBe('none');
  });
});
