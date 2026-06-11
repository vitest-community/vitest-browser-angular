---
'vitest-browser-angular': minor
---

chore: Update to PNPM 11

- Removed from package.json the "pnpm" field, which is no longer readed in PNPM 11.
- Added pnpm-workspace.yaml file with the "allowBuilds" field, which is required in PNPM 11 to allow building some dependencies.
- Updated the package.json with the field "devEngines" to specify the required version of PNPM and Node.js to work with this project.
