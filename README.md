# vitest-browser-angular

Render Angular components in VItest Browser Mode.

## Installation

```sh
pnpm add -D vitest-browser-angular
```

## Setup Test Environment

To set up your test environment (with Zone.js or Zoneless), use `@analogjs/vitest-angular`'s `setupTestBed()` function.

**Important:** Make sure to use `{ browserMode: true }` when calling `setupTestBed()` to enable Vitest browser mode's visual test preview functionality.

For detailed setup instructions for both Zone.js and Zoneless configurations, please refer to the [Analog Vitest documentation](https://analogjs.org/docs/features/testing/vitest).

## Usage

```ts
import { test, expect } from 'vitest';
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

## Inputs

Pass input values to components using the `inputs` option:

```ts
import { Component, input } from '@angular/core';

@Component({
  template: '<h2>{{ name() }}</h2><p>Price: ${{ price() }}</p>',
  standalone: true,
})
export class ProductComponent {
  name = input('Unknown Product');
  price = input(0);
}

test('render with inputs', async () => {
  const { component } = await render(ProductComponent, {
    inputs: {
      name: 'Laptop',
      price: 1299.99,
    },
  });

  await expect.element(component).toHaveTextContent('Laptop');
  await expect.element(component).toHaveTextContent('$1299.99');
});
```

Works with both signal-based inputs (`input()`) and `@Input()` decorators.

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
