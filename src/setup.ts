import { NgModule, provideZonelessChangeDetection } from "@angular/core";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

export function setupAngularTestEnvironment(isZoneless = true): void {
  @NgModule({
    providers: isZoneless ? [provideZonelessChangeDetection()] : [],
  })
  class ZonelessTestModule {}

  getTestBed().initTestEnvironment(
    [BrowserTestingModule, ...(isZoneless ? [ZonelessTestModule] : [])],
    platformBrowserTesting(),

    // We need to set this in order for browser mode to keep showing the component after the test
    { teardown: { destroyAfterEach: false } },
  );
}
