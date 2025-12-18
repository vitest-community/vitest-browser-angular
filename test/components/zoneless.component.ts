import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div>
      <h2>Zoneless Page</h2>
      <p data-testid="count">Count: {{ count }}</p>
      <button (click)="count = 0">Reset Count</button>
      <button (click)="count += 1">Update Count</button>
    </div>
  `,
})
export class ZonelessComponent {
  count = 0;

  constructor() {
    setInterval(() => {
      this.count++;
    }, 1000);
  }
}
