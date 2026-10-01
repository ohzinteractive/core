import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// Core imports GLSL sources as strings (rollup uses glslify for the build).
// Browser tests load modules through Vite, so serve them as raw strings too.
const glsl_as_string = {
  name: 'glsl-as-string',
  transform(code: string, id: string)
  {
    if (/\.(frag|vert|glsl)$/.test(id))
    {
      return { code: `export default ${JSON.stringify(code)};`, map: null };
    }
  }
};

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
        plugins: [glsl_as_string],
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
