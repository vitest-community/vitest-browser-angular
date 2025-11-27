import "@angular/compiler";
//
import "@analogjs/vitest-angular/setup-zone";
import { setupAngularTestEnvironment } from "./setup";

setupAngularTestEnvironment({ isZoneless: false });
