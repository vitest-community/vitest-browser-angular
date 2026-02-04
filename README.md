# vitest-browser-angular

This community package renders Angular components in [Vitest Browser Mode](https://vitest.dev/guide/browser).

```ts
import { Component, input } from '@angular/core'
import { expect, test } from 'vitest'
import { render } from 'vitest-browser-angular'

@Component({
  selector: 'app-hello-world',
  template: '<h1>Hello, {{ name() }}!</h1>',
})
export class HelloWorld {
  name = input.required<string>()
}

test('renders name', async () => {
  const { locator } = await render(HelloWorld, {
    inputs: {
      name: 'World',
    },
  })

  await expect.element(locator).toHaveTextContent('Hello, World!')
})
```

## Setup

There are currently two ways to set up Vitest for Angular:
- Angular CLI's [`unit-test` builder](https://angular.dev/guide/testing#configuration) *(official)*.
- Analog's [`vitest-angular` plugin](https://analogjs.org/docs/features/testing/vitest) *(community)*.


While Angular CLI's `unit-test` builder is the official way to set up Vitest for Angular, it has some [limitations](https://analogjs.org/docs/features/testing/overview#angular-support-for-vitest). Analog's `vitest-angular` plugin provides more Vitest features and greater flexibility.

### Setup with Analog Plugin

1. Set up Vitest

```sh
npm add -D @analogjs/platform @nx/devkit vitest-browser-angular

ng g @analogjs/platform:setup-vitest
```

2. Activate browser mode in the generated Vitest configuration by following the [browser mode configuration instructions](https://vitest.dev/guide/browser/#configuration).

### Setup with Angular CLI

1. Configure your Angular project to use the `@angular/build:unit-test` builder, and add the browsers of your choice.

```json
{
  ...,
  "projects": {
    "my-app": {
      ...,
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["Chromium", "Firefox", "Webkit"]
          }
        }
      }
    }
  }
}
```

*Since Angular v21, Vitest is the default runner so you don't need to set the `runner` option.*

2. Install the browser provider of your choice using `ng add`

```sh
# With Playwright
ng add @vitest/browser-playwright

# or with WebdriverIO
ng add @vitest/browser-webdriverio
```

3. Add the `vitest-browser-angular` package to your project.

```sh
npm add -D vitest-browser-angular
```


## Zone.js and Zoneless Setup

Angular CLI will automatically set up the test environment for you depending on the presence of `zone.js` in your project's polyfills.

When using the Analog plugin, you can control the behavior using the `zoneless` option of `setupTestBed()` in `test-setup.ts`:

```ts
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({
  zoneless: true,
});
```

For detailed setup instructions for both Zone.js and Zoneless configurations, please refer to the [Analog Vitest documentation](https://analogjs.org/docs/features/testing/vitest).


## Component Preview

To preview, debug and interact with a component in the browser after the test, you can prevent Angular from destroying it.

In Angular CLI, enable this using the `--debug` option.

With the Analog plugin, enable this using the `browserMode` option of `setupTestBed()` in `test-setup.ts`:

```ts
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

setupTestBed({
  browserMode: true,
});
```

## Usage

### Basic Example

The `render` function supports two query patterns:

```ts
import { test, expect } from 'vitest';
import { render } from 'vitest-browser-angular';

@Component({
  template: ` <h1>Welcome</h1> `,
})
export class MyComponent {}

test('query elements', async () => {
  // Pattern 1: Use locator to query within the component element
  const { locator } = await render(MyComponent);
  await expect.element(locator.getByText('Welcome')).toBeVisible();

  // Pattern 2: Use screen to query from document.body (useful for portals/overlays)
  const screen = await render(MyComponent);
  await expect.element(screen.getByText('Welcome')).toBeVisible();
  await expect.element(screen.getByText('Some Popover Content')).toBeVisible();
});
```

### Query Methods

Both `locator` and `screen` provide the following query methods:

- `getByRole` - Locate by ARIA role and accessible name
- `getByText` - Locate by text content
- `getByLabelText` - Locate by associated label text
- `getByPlaceholder` - Locate by placeholder text
- `getByAltText` - Locate by alt text (images)
- `getByTitle` - Locate by title attribute
- `getByTestId` - Locate by data-testid attribute

**When to use which pattern:**

- **`locator`**: (full name: "Component Locator") - queries are scoped to the component's host element. Best for most component tests.
- **`screen`**: Queries start from `baseElement` (defaults to `document.body`). Use when testing components that render content outside their host element (modals, tooltips, portals).

### Container Element

Access the component's host element directly via `container` (shortcut for `fixture.nativeElement`):

```ts
const { container, locator } = await render(MyComponent);
expect(container).toBe(locator.element());
```

### Base Element

Customize the root element for screen queries (useful for portal/overlay testing):

```ts
const customContainer = document.querySelector('#modal-root');
const screen = await render(ModalComponent, {
  baseElement: customContainer,
});
// screen queries now start from customContainer instead of document.body
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
  const screen = await render(ProductComponent, {
    inputs: {
      name: 'Laptop',
      price: 1299.99,
    },
  });

  await expect.element(screen.getByText('Laptop')).toBeVisible();
  await expect.element(screen.getByText(/Price: \$1299\.99/)).toBeVisible();
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
  const screen = await render(RoutedComponent, {
    withRouting: true,
  });

  await expect.element(screen.getByText('Home')).toBeVisible();
  await expect.element(screen.getByText('About')).toBeVisible();
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
  const { locator, router } = await render(AppComponent, {
    withRouting: {
      routes,
      initialRoute: '/home',
    },
  });

  await expect.element(locator).toHaveTextContent('Home Page');

  // Navigate programmatically
  await router.navigate(['/about']);
  await expect.element(locator).toHaveTextContent('About Page');
});
```

## Component Providers

If you need to add or override [component providers](https://angular.dev/guide/di/defining-dependency-providers#component-or-directive-providers), you can use the `componentProviders` option.

```ts
@Component({
  template: '<h1>{{ title }}</h1>',
  providers: [GreetingService],
})
export class HelloWorldComponent {
  title = 'Hello World';
}

test('renders component with service provider', async () => {
  const screen = await render(ServiceConsumerComponent, {
    componentProviders: [
      { provide: GreetingService, useClass: FakeGreetingService },
    ],
  });

  await expect.element(screen.getByText('Fake Greeting')).toBeVisible();
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
