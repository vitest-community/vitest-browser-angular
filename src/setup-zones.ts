import "@angular/compiler";
//
import "@analogjs/vitest-angular/setup-zone";
import { setupAngularTestEnvironment } from "./setup";

import { TestBed } from "@angular/core/testing";
import { beforeEach } from "vitest";

setupAngularTestEnvironment();
// Register global beforeEach to reset TestBed between tests
beforeEach(() => {
  TestBed.resetTestingModule();
});
