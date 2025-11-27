import { NgModule, provideZonelessChangeDetection } from "@angular/core";
import { getTestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";

export type SetupOptions = {
  isZoneless: boolean;
};

export function setupAngularTestEnvironment(
  options: SetupOptions = { isZoneless: true }, // Default to zoneless because from angular v21+ it is the default
): void {
  @NgModule({
    providers: options.isZoneless ? [provideZonelessChangeDetection()] : [],
  })
  class ZonelessTestModule {}

  getTestBed().initTestEnvironment(
    [BrowserTestingModule, ...(options.isZoneless ? [ZonelessTestModule] : [])],
    platformBrowserTesting(),

    // We need to set this in order for browser mode to keep showing the component after the test
    { teardown: { destroyAfterEach: false } },
  );
}
