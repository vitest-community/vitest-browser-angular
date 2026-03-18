# vitest-browser-angular

## 0.4.0

### Minor Changes

- ✨ Add support for Angular 21 (by [@gabrielmethot](https://github.com/gabrielmethot) in [#23](https://github.com/vitest-community/vitest-browser-angular/pull/23))

- ✨ add input binding to withRouting with option to disable (by [@shairez](https://github.com/shairez) in [#25](https://github.com/vitest-community/vitest-browser-angular/pull/25))

  By default, routing tests use Angular's `withComponentInputBinding()`, which binds route params, query params, and route `data` to matching component inputs.

  You can now pass `disableInputBinding: true` in your routing config to turn this off. When disabled, the router is provided without `withComponentInputBinding()`, so components won't auto-receive route data as inputs.

### Patch Changes

- 🐞🩹 routed component is now the activated route (by [@shairez](https://github.com/shairez) in [#25](https://github.com/vitest-community/vitest-browser-angular/pull/25))

  When using `withRouting`, the render result now correctly exposes the **activated route's component** as `componentClassInstance` (and uses the harness fixture for the same component).

  Previously, `componentClassInstance` and `fixture` could refer to a different component than the one actually rendered for the current route. Now they match the component instance that Angular Router activated for the initial (or current) route, so assertions on `componentClassInstance` (e.g. route params like `userId`) and direct fixture access behave as expected in tests.

## 0.3.0

### Minor Changes

- ✨ renamed `RenderConfig` type to `ComponentRenderOptions` (by [@shairez](https://github.com/shairez) in [#18](https://github.com/vitest-community/vitest-browser-angular/pull/18))

  `RenderConfig` is now deprecated and will be removed in a future version. Use `ComponentRenderOptions` instead.`

- ✨ return `container` element (by [@shairez](https://github.com/shairez) in [#18](https://github.com/vitest-community/vitest-browser-angular/pull/18))

  Now you can access the component's host element via the `container` property.
  This is basically a shortcut for `fixture.nativeElement`.

  ```ts
  test('renders component with service provider', async () => {
    const { container, fixture } = await render(HelloWorldComponent);

    expect(container).toBe(fixture.nativeElement);
  });
  ```

- ✨ decorated render result with element locators (which start with the baseElement) (by [@shairez](https://github.com/shairez) in [#18](https://github.com/vitest-community/vitest-browser-angular/pull/18))

  Now you can do this:

  ```ts
  test('renders component with service provider', async () => {
    const screen = await render(HelloWorldComponent);
    await expect.element(screen.getByText('Hello World')).toBeVisible(); // uses the baseElement as the root element for the query selector
  });
  ```

- ✨ add `baseElement` (by [@shairez](https://github.com/shairez) in [#18](https://github.com/vitest-community/vitest-browser-angular/pull/18))

  Now default locators will be based on the `baseElement` instead of the component element.
  This helps with testing components which project to a portal.

- ✨ renamed `component` to `locator` to match other vitest-browser libraries api (by [@shairez](https://github.com/shairez) in [#18](https://github.com/vitest-community/vitest-browser-angular/pull/18))

  `component` is now deprecated and will be removed in a future version. Use `locator` instead.

## 0.2.0

### Minor Changes

- ✨ component providers (by [@shairez](https://github.com/shairez) in [#16](https://github.com/vitest-community/vitest-browser-angular/pull/16))

  If you need to override providers defined on the component decorator, you can use the `componentProviders` option:

  ```ts
  @Component({
    template: '<h1>{{ title }}</h1>',
    providers: [GreetingService],
  })
  export class HelloWorldComponent {
    title = 'Hello World';
  }

  test('renders component with service provider', async () => {
    const { component } = await render(HelloWorldComponent, {
      componentProviders: [
        { provide: GreetingService, useClass: FakeGreetingService },
      ],
    });
  });
  ```

## 0.1.0

### Minor Changes

- ✨ deprecate `setup-zones` in favor of analog's setupTestBed (by [@shairez](https://github.com/shairez) in [#12](https://github.com/vitest-community/vitest-browser-angular/pull/12))

  **Motivation**

  Analog has implemented their own `setupTestBed()` function that provides a more comprehensive and maintained solution for setting up Angular tests with Vitest.

  Rather than maintaining duplicate setup logic and keeping documentation in sync, we're directing users to Analog's official documentation.

  **Migration Guide**

  Users should migrate from:

  ```ts
  // vitest.config.ts

  setupFiles: ['vitest-browser-angular/setup-zones'];
  ```

  To using Analog's `setupTestBed()`:

  ```ts
  setupTestBed({ browserMode: true });
  ```

  See https://analogjs.org/docs/features/testing/vitest for full instructions

### Patch Changes

- ✨ expose config types (by [@shairez](https://github.com/shairez) in [#8](https://github.com/vitest-community/vitest-browser-angular/pull/8))

- 🛠 added test,lint and build checks in CI for PRs (by [@shairez](https://github.com/shairez) in [#8](https://github.com/vitest-community/vitest-browser-angular/pull/8))

- 🐞🩹 component type in render function (by [@shairez](https://github.com/shairez) in [#12](https://github.com/vitest-community/vitest-browser-angular/pull/12))

- 🛠 Implemented tests for zoneless setup (by [@MRinaldi9](https://github.com/MRinaldi9) in [#6](https://github.com/vitest-community/vitest-browser-angular/pull/6))

- ✨ when rendering you can now pass input values to a component (by [@shairez](https://github.com/shairez) in [#8](https://github.com/vitest-community/vitest-browser-angular/pull/8))

## 0.0.4

### Patch Changes

- 🐞🩹 wrong types generated for index.ts (by [@shairez](https://github.com/shairez) in [`48c3b0f`](https://github.com/hirezio/vitest-browser-angular/commit/48c3b0f701e62570d309574aa52d9bf6cbeba52b))

## 0.0.3

### Patch Changes

- Changed API to match other vitest browser mode libs (by [@shairez](https://github.com/shairez) in [`5959be0`](https://github.com/hirezio/vitest-browser-angular/commit/5959be0bdac2a624db5a47d753c012e81058230e))
  `mount` is now `render` and you import it instead of having it as a fixture/context.

  (You can always create your own by extending the `test` function and having the render function injected instead of imported)

## 0.0.2

### Patch Changes

- ✨ withRouting is now also a boolean (by [@shairez](https://github.com/shairez) in [`3a6364b`](https://github.com/hirezio/vitest-browser-angular/commit/3a6364b0c2bb41d098a8a7d64b33fb740c68fa05))

## 0.0.1

### Patch Changes

- component now returns a locator of the component native element (by [@shairez](https://github.com/shairez) in [`f6b6c26`](https://github.com/hirezio/vitest-browser-angular/commit/f6b6c26438de0dfaf554c2b5d7f9ef844f803a75))
