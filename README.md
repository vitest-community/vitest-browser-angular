# vitest-browser-angular

Render Angular components in VItest Browser Mode.

## Installation

```sh
pnpm add -D vitest-browser-angular
```

## Setup Test Environment with Zone.js

```ts
// vitest.config.ts

import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,

    // 👇 This is what you need to add
    setupFiles: ['vitest-browser-angular/setup-zones'],

    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

## Setup Test Environment with Zoneless

```ts
// vitest.config.ts

import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  test: {
    globals: true,

    // 👇 This is what you need to add
    setupFiles: ['vitest-browser-angular/setup-zoneless'],

    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

## Usage

```ts
import { test, expect } from 'vitest-browser-angular';
import { render } from 'vitest-browser-angular';

@Component({
  template: '<h1>{{ title }}</h1>',
})
export class HelloWorldComponent {
  title = 'Hello World';
}

test('render', async () => {
  const { component } = await render(HelloWorldComponent);
  await expect.element(component).toHaveTextContent('Hello World');
});
```

## Routing

### Simple Routing

Enable routing with `withRouting: true` for components that use routing features but don't require specific route configuration:

```ts
import { test, expect } from 'vitest';
import { render } from 'vitest-browser-angular';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  template: `
    <nav>
      <a routerLink="/home">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  imports: [RouterLink, RouterOutlet],
})
export class RoutedComponent {}

test('render with simple routing', async () => {
  const { component } = await render(RoutedComponent, {
    withRouting: true,
  });

  await expect.element(component).toHaveTextContent('Home');
  await expect.element(component).toHaveTextContent('About');
});
```

### Routing with Configuration

Configure specific routes and optionally set an initial route:

```ts
import { test, expect } from 'vitest';
import { render } from 'vitest-browser-angular';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, Routes } from '@angular/router';

@Component({
  template: '<h1>Home Page</h1>',
})
export class HomeComponent {}

@Component({
  template: '<h1>About Page</h1>',
  standalone: true,
})
export class AboutComponent {}

@Component({
  template: `
    <nav>
      <a routerLink="/home">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  imports: [RouterLink, RouterOutlet],
  standalone: true,
})
export class AppComponent {
  router = inject(Router);
}

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

test('render with route configuration', async () => {
  const { component, router } = await render(AppComponent, {
    withRouting: {
      routes,
      initialRoute: '/home',
    },
  });

  await expect.element(component).toHaveTextContent('Home Page');

  // Navigate programmatically
  await router.navigate(['/about']);
  await expect.element(component).toHaveTextContent('About Page');
});
```

## Contributing

Want to contribute? Yayy! 🎉

Please read and follow our [Contributing Guidelines](CONTRIBUTING.md) to learn what are the right steps to take before contributing your time, effort and code.

Thanks 🙏

<br/>

## Code Of Conduct

Be kind to each other and please read our [code of conduct](CODE_OF_CONDUCT.md).

<br/>

## Credits

This project is inspired by the following projects:

[vitest-browser-vue](https://github.com/vitest-dev/vitest-browser-vue)
[angular-testing-library](https://github.com/testing-library/angular-testing-library)

## License

MIT
