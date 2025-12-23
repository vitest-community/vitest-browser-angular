import '@angular/compiler';
//
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import '@analogjs/vitest-angular/setup-zone';

setupTestBed({
  zoneless: false,
  browserMode: true,
});
