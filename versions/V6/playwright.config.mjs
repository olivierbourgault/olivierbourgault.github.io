import fs from 'node:fs';
import { chromium, defineConfig } from '@playwright/test';

const hasBundledChromium = (() => {
  try {
    return fs.existsSync(chromium.executablePath());
  } catch {
    return false;
  }
})();

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    headless: true,
    viewport: { width: 1440, height: 900 },
    ...(hasBundledChromium
      ? {}
      : { channel: process.platform === 'win32' ? 'msedge' : 'chrome' })
  },
  webServer: {
    command: 'node tools/serve-site.mjs --port 8080',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 15_000
  }
});
