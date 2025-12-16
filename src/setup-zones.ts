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

console.warn(
  '[vitest-browser-angular] WARNING: The "vitest-browser-angular/setup-zones" setup file is deprecated and will be removed in a future version. ' +
    "Please migrate to @analogjs/vitest-angular's setupTestBed() with { browserMode: true }. " +
    "See: https://analogjs.org/docs/features/testing/vitest",
);

import "@angular/compiler";
//
import "@analogjs/vitest-angular/setup-zone";
import { TestBed } from "@angular/core/testing";
import { beforeEach } from "vitest";
import { setupAngularTestEnvironment } from "./setup";

setupAngularTestEnvironment();
// Register global beforeEach to reset TestBed between tests
beforeEach(() => {
  TestBed.resetTestingModule();
});
