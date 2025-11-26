---
'vitest-browser-angular': minor
---

Implemented configuration for zoneless with a new setup file (`setup-zoneless.ts`)

- Added specific config for zoneless vitest for run specific set of tests
- Modified `setupAngularTestEnvironment` to accept a parameter for zoneless setup (by default setted to true for v21+)
- Updated README with zoneless setup instructions
- Implemented tests for zoneless setup
