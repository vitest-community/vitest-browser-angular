/**
 * @deprecated This file is deprecated and will be removed in a future version.
 *
 * Please use @analogjs/vitest-angular's setupTestBed() instead with the browserMode: true option.
 *
 * See Analog's documentation for setup instructions:
 * https://analogjs.org/docs/features/testing/vitest
 *
 * Important: Make sure to use { browserMode: true } when calling setupTestBed() to enable
 * Vitest browser mode's visual test preview functionality.
 */

import { getTestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

export type SetupOptions = {
  isZoneless: boolean;
};

export function setupAngularTestEnvironment(): void {
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),

    // We need to set this in order for browser mode to keep showing the component after the test
    { teardown: { destroyAfterEach: false } },
  );
}
