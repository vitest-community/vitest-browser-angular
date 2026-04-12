import type {
  EnvironmentProviders,
  InputSignal,
  Provider,
  Type,
} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  inputBinding,
} from "@angular/core";
import {
  type ComponentFixture,
  ɵgetCleanupHook as getCleanupHook,
  TestBed,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import {
  provideRouter,
  Router,
  Routes,
  withComponentInputBinding,
} from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import {
  type Locator,
  type LocatorSelectors,
  page,
  type PrettyDOMOptions,
  utils,
} from "vitest/browser";

const { debug, getElementLocatorSelectors } = utils;

/**
 * Configuration options for rendering components with Angular Router support.
 *
 * @example
 * ```typescript
 * // Basic routing with route params
 * await render(UserComponent, {
 *   withRouting: {
 *     routes: [{ path: 'user/:id', component: UserComponent }],
 *     initialRoute: '/user/42',
 *   },
 * });
 *
 * // Passing inputs via route data (uses withComponentInputBinding)
 * await render(ProfileComponent, {
 *   withRouting: {
 *     routes: [{
 *       path: 'profile',
 *       component: ProfileComponent,
 *       data: { name: 'John', age: 30 },
 *     }],
 *     initialRoute: '/profile',
 *   },
 * });
 * ```
 */
export interface RoutingConfig {
  /**
   * The route configuration to use. These routes are passed to `provideRouter()`.
   */
  routes: Routes;

  /**
   * The initial route to navigate to after setting up the router.
   * This triggers navigation and activates the matching route's component.
   *
   * @example '/user/42' or '/profile?tab=settings'
   */
  initialRoute?: string;

  /**
   * When `true`, disables Angular's `withComponentInputBinding()` feature.
   *
   * By default, `withComponentInputBinding()` is enabled, which automatically
   * binds route params, query params, and route data to matching component inputs.
   *
   * Set this to `true` if you want to manually handle route data via `ActivatedRoute`.
   *
   * @default false
   */
  disableInputBinding?: boolean;
}

export type Inputs<CMP_TYPE extends Type<unknown>> = Partial<{
  [PROP in keyof InstanceType<CMP_TYPE> as InstanceType<CMP_TYPE>[PROP] extends InputSignal<unknown>
    ? PROP
    : never]: InstanceType<CMP_TYPE>[PROP] extends InputSignal<infer VALUE>
    ? VALUE
    : never;
}>;

/**
 * Options for rendering a component with `render()`.
 */
export interface ComponentRenderOptions<
  CMP_TYPE extends Type<unknown> = Type<unknown>,
> {
  /** The base element to render into. Defaults to `document.body`. */
  baseElement?: HTMLElement;

  /**
   * Input values to pass to the component.
   *
   * Note: When using `withRouting`, inputs cannot be passed directly.
   * Use route `data` instead.
   */
  inputs?: Inputs<CMP_TYPE>;

  /**
   * Enable Angular Router support for the component.
   *
   * - When `true`: Creates a wildcard route for the component and navigates to `/`.
   * - When `RoutingConfig`: Uses the provided routes and initial route.
   *
   * By default, `withComponentInputBinding()` is enabled, allowing you to pass
   * inputs via route `data`, route params, or query params.
   *
   * @example
   * ```typescript
   * // Simple routing (component matches any route)
   * await render(MyComponent, { withRouting: true });
   *
   * // Full routing configuration
   * await render(UserComponent, {
   *   withRouting: {
   *     routes: [
   *       { path: 'user/:id', component: UserComponent, data: { role: 'admin' } }
   *     ],
   *     initialRoute: '/user/42',
   *   },
   * });
   * ```
   */
  withRouting?: RoutingConfig | boolean;

  /** Additional providers to configure in the testing module. */
  providers?: Array<Provider | EnvironmentProviders>;

  /** Providers to add specifically to the component being rendered. */
  componentProviders?: Array<Provider>;

  /** Additional imports for the testing module. */
  imports?: unknown[];
}
/**
 * @deprecated Use ComponentRenderOptions instead
 */
export type RenderConfig<CMP_TYPE extends Type<unknown> = Type<unknown>> =
  ComponentRenderOptions<CMP_TYPE>;

export interface RenderResult<T> extends LocatorSelectors {
  baseElement: HTMLElement;
  container: HTMLElement;
  /**
   * The ComponentFixture for the rendered component.
   * When using `withRouting`, this is the RouterTestingHarness's internal fixture
   * not a fixture of `T` directly.
   */
  fixture:
    | ComponentFixture<T>
    | InstanceType<typeof RouterTestingHarness>["fixture"];
  debug(
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ): void;

  /**
   * @deprecated Use locator instead
   */
  component: Locator;

  /** Vitest browser locator scoped to the rendered component's container. */
  locator: Locator;

  /** The instance of the rendered component's class. */
  componentClassInstance: T;

  /**
   * The RouterTestingHarness instance. Only available when `withRouting` is used.
   *
   * **Preferred for navigation in tests.** Use `navigateByUrl()` which:
   * - Waits for all redirects to complete
   * - Automatically runs change detection
   * - Returns the activated component instance
   * - Handles guard rejections gracefully
   *
   * @example
   * ```typescript
   * // Navigate and get the activated component
   * const userComponent = await routerHarness.navigateByUrl('/user/42', UserComponent);
   *
   * // Simple navigation
   * await routerHarness.navigateByUrl('/about');
   * ```
   */
  routerHarness?: RouterTestingHarness;

  /**
   * The Angular Router instance. Only available when `withRouting` is used.
   *
   * Useful for inspecting router state. For navigation, prefer `routerHarness.navigateByUrl()`.
   *
   * @example
   * ```typescript
   * expect(router.url).toBe('/user/42');
   * ```
   */
  router?: Router;
}

export type RenderFn = <T>(
  component: Type<T>,
  options?: ComponentRenderOptions<Type<T>>,
) => Promise<RenderResult<T>>;

/**
 * Renders an Angular component for testing with Vitest Browser Mode.
 *
 * @param componentClass - The component class to render
 * @param options - Configuration options for rendering
 * @returns A promise that resolves to the render result with locators and component access
 *
 * @example
 * ```typescript
 * // Basic render
 * const { locator } = await render(MyComponent);
 * await expect.element(locator.getByText('Hello')).toBeVisible();
 *
 * // With inputs
 * const { componentClassInstance } = await render(UserComponent, {
 *   inputs: { name: 'John', age: 30 },
 * });
 *
 * // With routing and route data as inputs
 * const { router } = await render(ProfileComponent, {
 *   withRouting: {
 *     routes: [{ path: 'profile', component: ProfileComponent, data: { userId: '42' } }],
 *     initialRoute: '/profile',
 *   },
 * });
 * ```
 */
export async function render<T>(
  componentClass: Type<T>,
  options?: ComponentRenderOptions<Type<T>>,
): Promise<RenderResult<T>> {
  const imports = [componentClass, ...(options?.imports || [])];
  const providers = [...(options?.providers || [])];
  const baseElement = options?.baseElement || document.body;

  if (options?.withRouting && options?.inputs) {
    console.warn(
      "[vitest-browser-angular] Using `inputs` with `withRouting` is not supported. " +
        "Inputs cannot be passed directly to routed components. " +
        "Consider passing data via route params, query params, or route data instead.",
    );
  }

  const routingConfig: RoutingConfig | undefined = options?.withRouting
    ? typeof options.withRouting === "boolean"
      ? {
          routes: [{ path: "**", component: componentClass }],
          initialRoute: "/",
        }
      : options.withRouting
    : undefined;

  if (routingConfig) {
    if (routingConfig.disableInputBinding) {
      providers.push(provideRouter(routingConfig.routes));
    } else {
      providers.push(
        provideRouter(routingConfig.routes, withComponentInputBinding()),
      );
    }
  }

  TestBed.configureTestingModule({
    imports,
    providers,
  });

  if (options?.componentProviders) {
    TestBed.overrideComponent(componentClass, {
      add: {
        providers: options.componentProviders,
      },
    });
  }

  let fixture: RenderResult<T>["fixture"];
  let container: HTMLElement;
  let componentClassInstance: T;
  let routerHarness: RouterTestingHarness | undefined;
  let router: Router | undefined;

  if (routingConfig) {
    routerHarness = await RouterTestingHarness.create(
      routingConfig.initialRoute,
    );
    router = TestBed.inject(Router);

    fixture = routerHarness.fixture;
    container = routerHarness.routeNativeElement!;
    componentClassInstance = routerHarness.routeDebugElement
      ?.componentInstance as T;
  } else {
    const bindings = Object.entries(options?.inputs ?? {}).map(([key, value]) =>
      inputBinding(key, () => value),
    );

    fixture = TestBed.createComponent(componentClass, { bindings });
    container = fixture.nativeElement;
    componentClassInstance = fixture.componentInstance;
  }

  fixture.autoDetectChanges();
  await fixture.whenStable();

  const locator = page.elementLocator(container);

  return {
    baseElement,
    container,
    fixture,
    debug: (el = baseElement, maxLength, opts) => debug(el, maxLength, opts),
    componentClassInstance,
    component: locator, // deprecated, this will be removed in a future version
    locator,
    routerHarness,
    router,
    ...getElementLocatorSelectors(baseElement),
  };
}

export interface DirectiveRenderOptions {
  /** Template to render the directive in. Must include the directive selector. */
  template: string;

  /** Host component input values to pass and make reactive. */
  hostProps?: Record<string, unknown>;

  /** Additional imports for the test module. */
  imports?: Type<unknown>[];

  /** Additional providers for the test module. */
  providers?: Provider[];

  /** The base element for screen queries. Defaults to document.body. */
  baseElement?: HTMLElement;
}

export interface DirectiveRenderResult<T> extends LocatorSelectors {
  container: HTMLElement;
  baseElement: HTMLElement;
  /**
   * The host component's fixture.
   */
  fixture: ComponentFixture<unknown>;
  /**
   * Instance of the tested directive.
   */
  directiveInstance: T;
  /**
   * Locator scoped to the host element where the directive is applied.
   */
  locator: Locator;
  /**
   * Debug function for the directive's element.
   */
  debug(
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ): void;
}

/**
 * Renders a directive for testing with Vitest Browser Mode.
 *
 * @param directiveClass - The directive class to test
 * @param options - Configuration including the template where the directive is applied
 * @returns A render result with fixture, directive instance, and query methods
 *
 * @example
 * ```typescript
 * // Basic directive test
 * const { directiveInstance, locator } = await renderDirective(HighlightDirective, {
 *   template: `<div appHighlight>Test</div>`,
 * });
 *
 * // With host input binding
 * const { locator } = await renderDirective(HighlightDirective, {
 *   template: `<div [appHighlight]="color" (blurred)="onClick($event)">Test</div>`,
 *   hostProps: { color: 'red', onClick: vi.fn() },
 *   imports: [JsonPipe], // extra imports for template
 * });
 * ```
 */
export async function renderDirective<T>(
  directiveClass: Type<T>,
  options: DirectiveRenderOptions,
): Promise<DirectiveRenderResult<T>> {
  const baseElement = options.baseElement || document.body;
  const imports = [directiveClass, ...(options.imports || [])];
  const providers = [...(options.providers || [])];
  const hostProps = options.hostProps || {};
  @Component({
    selector: "test-host",
    imports,
    template: options.template,
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestHostComponent {
    constructor() {
      if (options.hostProps) {
        Object.assign(this, hostProps);
      }
    }
  }

  const { fixture, container, locator, debug } = await render(
    TestHostComponent,
    {
      providers,
      baseElement,
    },
  );
  const directiveDE = fixture.debugElement.query(By.directive(directiveClass));
  if (!directiveDE) {
    throw new Error(
      `[renderDirective] Could not find directive ${directiveClass.name} in template. ` +
        `Make sure the template includes the directive selector and it is imported.`,
    );
  }
  return {
    container,
    baseElement,
    fixture,
    locator,
    directiveInstance: directiveDE.injector.get(directiveClass) as T,
    debug: (el = container, maxLength?: number, opts?: PrettyDOMOptions) =>
      debug(el, maxLength, opts),
    ...getElementLocatorSelectors(baseElement),
  };
}

export function cleanup(shouldTeardown = false) {
  return getCleanupHook(shouldTeardown)();
}
