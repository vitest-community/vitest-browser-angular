import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-routed',
  template: `
    <div>
      <h1>Routed Component</h1>
      <nav>
        <a routerLink="/home" routerLinkActive="active">Home</a>
        <a routerLink="/about" routerLinkActive="active">About</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </nav>
      <div>
        <button (click)="navigateToHome()">Navigate to Home</button>
        <button (click)="navigateToAbout()">Navigate to About</button>
        <button (click)="navigateToContact()">Navigate to Contact</button>
      </div>
      <div>
        <p>Current URL: {{ currentUrl }}</p>
        <p>Navigation count: {{ navigationCount }}</p>
      </div>
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [RouterLink, RouterOutlet],
  standalone: true,
})
export class RoutedComponent {
  private router = inject(Router);
  currentUrl = '';
  navigationCount = 0;

  constructor() {
    this.currentUrl = this.router.url;
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
      this.navigationCount++;
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }
}

@Component({
  selector: 'app-user-with-route-param',
  template: `<h1>User: {{ userId }}</h1>`,
  standalone: true,
})
export class UserWithRouteParamComponent {
  private route = inject(ActivatedRoute);
  userId = this.route.snapshot.params['id'];
}
