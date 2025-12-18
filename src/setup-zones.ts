import "@angular/compiler";
//
import "@analogjs/vitest-angular/setup-zone";
import { TestBed } from "@angular/core/testing";
import { beforeEach } from "vitest";
import { setupAngularTestEnvironment } from "./setup";

setupAngularTestEnvironment({ isZoneless: false });
// Register global beforeEach to reset TestBed between tests
beforeEach(() => {
  TestBed.resetTestingModule();
});
