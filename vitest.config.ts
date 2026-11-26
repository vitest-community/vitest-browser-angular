import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defaultExclude, defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [angular({ tsconfig: './tsconfig.json' })],
        test: {
          name: { label: 'zone', color: 'red' },
          setupFiles: ['./test/vitest-zones-setup.ts'],
          exclude: [
            ...defaultExclude,
            '**/zoneless.test.ts',
            '**/defer.test.ts',
          ],
        },
      },
      {
        extends: true,
        plugins: [angular({ tsconfig: './tsconfig.json' })],
        test: {
          name: { label: 'zoneless', color: 'magenta' },
          setupFiles: ['./test/vitest-zoneless-setup.ts'],
          include: ['**/zoneless.test.ts'],
        },
      },
      {
        extends: true,
        // Ahead-of-time, as `ng test` and production builds compile: only AOT
        // gives a component with a lazy `@defer` dependency async metadata.
        plugins: [angular({ tsconfig: './tsconfig.json', jit: false })],
        test: {
          name: { label: 'aot', color: 'blue' },
          setupFiles: ['./test/vitest-zones-setup.ts'],
          include: ['**/defer.test.ts'],
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
