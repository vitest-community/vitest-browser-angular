import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="user-profile">
      <h2>{{ name() }}</h2>
      <p class="age">Age: {{ age() }}</p>
      <p class="email">Email: {{ email() }}</p>
      <p class="is-active">Status: {{ isActive() ? 'Active' : 'Inactive' }}</p>
      <p class="full-info">{{ fullInfo() }}</p>
      <button (click)="send.emit()">Send</button>
    </div>
  `,
})
export class UserProfileComponent {
  name = input('Guest');
  age = input(0);
  email = input('');
  isActive = input(false);

  send = output<void>();

  fullInfo = computed(() => {
    return `${this.name()} (${this.age()} years old) - ${this.email()}`;
  });
}

@Component({
  imports: [UserProfileComponent],
  selector: 'my-component',
  template: `<app-user-profile name="John Doe"></app-user-profile>`,
})
export class MyComponent {}
