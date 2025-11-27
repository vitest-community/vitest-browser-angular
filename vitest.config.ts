import { playwright } from '@vitest/browser-playwright';
import { defineConfig, defaultExclude } from 'vitest/config';
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'zone', color: 'red' },
          setupFiles: ['./src/setup-zones.ts'],
          exclude: [...defaultExclude, '**/zoneless.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'zoneless', color: 'magenta' },
          setupFiles: ['./src/setup-zoneless.ts'],
          include: ['**/zoneless.test.ts'],
        },
      },
    ],
    globals: true,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
