import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defaultExclude, defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [angular({ tsconfig: './tsconfig.json' })],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: { label: 'zone', color: 'red' },
          setupFiles: ['./test/vitest-zones-setup.ts'],
          exclude: [...defaultExclude, '**/zoneless.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: { label: 'zoneless', color: 'magenta' },
          setupFiles: ['./test/vitest-zoneless-setup.ts'],
          include: ['**/zoneless.test.ts'],
        },
      },
    ],
    globals: true,
    watch: false,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
