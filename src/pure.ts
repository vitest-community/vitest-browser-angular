import type {
  EnvironmentProviders,
  InputSignal,
  Provider,
  Type,
} from "@angular/core";
import { inputBinding } from "@angular/core";
import {
  type ComponentFixture,
  ɵgetCleanupHook as getCleanupHook,
  TestBed,
} from "@angular/core/testing";
import { provideRouter, Router, Routes } from "@angular/router";
import { RouterTestingHarness } from "@angular/router/testing";
import {
  type Locator,
  type LocatorSelectors,
  page,
  type PrettyDOMOptions,
  utils,
} from "vitest/browser";

const { debug, getElementLocatorSelectors } = utils;
export interface RoutingConfig {
  routes: Routes;
  initialRoute?: string;
}

export type Inputs<CMP_TYPE extends Type<unknown>> = Partial<{
  [PROP in keyof InstanceType<CMP_TYPE> as InstanceType<CMP_TYPE>[PROP] extends InputSignal<unknown>
    ? PROP
    : never]: InstanceType<CMP_TYPE>[PROP] extends InputSignal<infer VALUE>
    ? VALUE
    : never;
}>;

export interface ComponentRenderOptions<
  CMP_TYPE extends Type<unknown> = Type<unknown>,
> {
  baseElement?: HTMLElement;
  inputs?: Inputs<CMP_TYPE>;
  withRouting?: RoutingConfig | boolean;
  providers?: Array<Provider | EnvironmentProviders>;
  componentProviders?: Array<Provider>;
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
  fixture: ComponentFixture<T>;
  debug(
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions,
  ): void;

  /**
   * @deprecated Use locator instead
   */
  component: Locator;
  locator: Locator;
  componentClassInstance: T;
  routerHarness?: RouterTestingHarness;
  router?: Router;
}

export type RenderFn = <T>(
  component: Type<T>,
  options?: ComponentRenderOptions<Type<T>>,
) => Promise<RenderResult<T>>;

export async function render<T>(
  componentClass: Type<T>,
  options?: ComponentRenderOptions<Type<T>>,
): Promise<RenderResult<T>> {
  const imports = [componentClass, ...(options?.imports || [])];
  const providers = [...(options?.providers || [])];
  const renderResult: Partial<RenderResult<T>> = {};

  const baseElement = options?.baseElement || document.body;

  if (options?.withRouting) {
    const routes =
      typeof options.withRouting === "boolean"
        ? []
        : options.withRouting.routes;
    providers.push(provideRouter(routes));
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

  if (options?.withRouting) {
    const routerHarness = await RouterTestingHarness.create(
      typeof options.withRouting === "boolean"
        ? undefined
        : options.withRouting.initialRoute,
    );
    renderResult.routerHarness = routerHarness;
    renderResult.router = TestBed.inject(Router);
  }

  const bindings = Object.entries(options?.inputs ?? {}).map(([key, value]) =>
    inputBinding(key, () => value),
  );
  const fixture = TestBed.createComponent(componentClass, {
    bindings,
  });
  fixture.autoDetectChanges();
  await fixture.whenStable();

  const container = fixture.nativeElement;

  const locator = page.elementLocator(container);

  return {
    ...renderResult,
    baseElement,
    container,
    fixture,
    debug: (el = baseElement, maxLength, options) =>
      debug(el, maxLength, options),
    componentClassInstance: fixture.componentInstance,
    component: locator, // will be removed in future versions
    locator,
    ...getElementLocatorSelectors(baseElement),
  };
}

export function cleanup(shouldTeardown = false) {
  return getCleanupHook(shouldTeardown)();
}
