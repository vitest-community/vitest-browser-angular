import { Component, inject, Injectable } from '@angular/core';
import { DeferredChildComponent } from './deferred-child.component';

@Injectable()
export class DeferredGreetingService {
  greeting = 'Hello from the default provider';
}

/**
 * `DeferredChildComponent` is used only inside `@defer`, so an ahead-of-time
 * compiler loads it lazily and gives this component async metadata
 * (`ɵsetClassMetadataAsync`).
 */
@Component({
  selector: 'app-deferred',
  imports: [DeferredChildComponent],
  providers: [DeferredGreetingService],
  template: `
    <h2 data-testid="greeting">{{ greeting }}</h2>
    @defer (on immediate) {
      <app-deferred-child />
    }
  `,
})
export class DeferredComponent {
  greeting = inject(DeferredGreetingService).greeting;
}
