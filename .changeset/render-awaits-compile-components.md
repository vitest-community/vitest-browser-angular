---
'vitest-browser-angular': patch
---

fix: `render()` awaits `TestBed.compileComponents()` before creating the component

A component compiled ahead of time whose `@defer` block has lazy dependencies gets async metadata. When `render()` overrode it (`componentProviders`), creating it threw "Component '…' has unresolved metadata. Please call `await TestBed.compileComponents()` before running this test." — with or without `withRouting`. `render()` now resolves that metadata after applying overrides; where nothing is pending the call is a no-op.
