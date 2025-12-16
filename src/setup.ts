import { getTestBed, TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

export function setupAngularTestEnvironment(): void {
  if (TestBed.platform) {
    return;
  }
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),

    // We need to set this in order for browser mode to keep showing the component after the test
    { teardown: { destroyAfterEach: false } },
  );
}
