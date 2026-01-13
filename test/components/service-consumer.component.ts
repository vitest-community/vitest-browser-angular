import { Component, inject, Injectable } from '@angular/core';

@Injectable()
export class GreetingService {
  getGreeting(name: string): string {
    return `Hello, ${name}!`;
  }
}

@Injectable()
export class CustomGreetingService extends GreetingService {
  override getGreeting(name: string): string {
    return `Welcome, ${name}! Nice to see you.`;
  }
}

@Component({
  selector: 'app-service-consumer',
  template: `
    <div>
      <h1 data-testid="greeting">{{ greeting }}</h1>
      <p data-testid="message">{{ message }}</p>
    </div>
  `,
})
export class ServiceConsumerComponent {
  private greetingService = inject(GreetingService);

  greeting = this.greetingService.getGreeting('World');
  message = 'This component uses injected services';
}
