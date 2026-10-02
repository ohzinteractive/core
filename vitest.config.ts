import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/**/*.browser.test.ts']
        }
      },
      {
        test: {
          name: 'browser',
          include: ['tests/**/*.browser.test.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions: {
                args: ['--enable-unsafe-webgpu', '--enable-gpu', '--ignore-gpu-blocklist']
              }
            }),
            instances: [{ browser: 'chromium' }]
          }
        }
      }
    ]
  }
});
