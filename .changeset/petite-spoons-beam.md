---
'vitest-browser-angular': minor
---

FEAT: deprecate `setup-zones` in favor of analog's setupTestBed

**Motivation**

Analog has implemented their own `setupTestBed()` function that provides a more comprehensive and maintained solution for setting up Angular tests with Vitest.

Rather than maintaining duplicate setup logic and keeping documentation in sync, we're directing users to Analog's official documentation.

**Migration Guide**

Users should migrate from:

```ts
// vitest.config.ts

setupFiles: ['vitest-browser-angular/setup-zones'];
```

To using Analog's `setupTestBed()`:

```ts
setupTestBed({ browserMode: true });
```

See https://analogjs.org/docs/features/testing/vitest for full instructions
