---
'vitest-browser-angular': patch
---

FIX: routed component is now the activated route

When using `withRouting`, the render result now correctly exposes the **activated route's component** as `componentClassInstance` (and uses the harness fixture for the same component).

Previously, `componentClassInstance` and `fixture` could refer to a different component than the one actually rendered for the current route. Now they match the component instance that Angular Router activated for the initial (or current) route, so assertions on `componentClassInstance` (e.g. route params like `userId`) and direct fixture access behave as expected in tests.
