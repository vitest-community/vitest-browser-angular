---
'vitest-browser-angular': minor
---

FEAT: add `baseElement`

Now default locators will be based on the `baseElement` instead of the component element.
This helps with testing components which project to a portal.
