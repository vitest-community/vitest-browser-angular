---
'vitest-browser-angular': minor
---

FEAT: add input binding to withRouting with option to disable

By default, routing tests use Angular's `withComponentInputBinding()`, which binds route params, query params, and route `data` to matching component inputs.

You can now pass `disableInputBinding: true` in your routing config to turn this off. When disabled, the router is provided without `withComponentInputBinding()`, so components won't auto-receive route data as inputs.
