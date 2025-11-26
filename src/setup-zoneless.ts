import "@angular/compiler";

import "@analogjs/vitest-angular/setup-snapshots";
import { setupAngularTestEnvironment } from "./setup";

globalThis.__ZONELESS__ = true;
setupAngularTestEnvironment();
