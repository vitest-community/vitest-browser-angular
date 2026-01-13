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
import { type Locator, page } from "vitest/browser";

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

export interface RenderConfig<CMP_TYPE extends Type<unknown> = Type<unknown>> {
  inputs?: Inputs<CMP_TYPE>;
  withRouting?: RoutingConfig | boolean;
  providers?: Array<Provider | EnvironmentProviders>;
  componentProviders?: Array<Provider>;
  imports?: unknown[];
}

export interface RenderResult<T> {
  fixture: ComponentFixture<T>;
  component: Locator;
  componentClassInstance: T;
  routerHarness?: RouterTestingHarness;
  router?: Router;
}

export type RenderFn = <T>(
  component: Type<T>,
  config?: RenderConfig<Type<T>>,
) => Promise<RenderResult<T>>;

export async function render<T>(
  componentClass: Type<T>,
  config?: RenderConfig<Type<T>>,
): Promise<RenderResult<T>> {
  const imports = [componentClass, ...(config?.imports || [])];
  const providers = [...(config?.providers || [])];
  const renderResult: Partial<RenderResult<T>> = {};

  if (config?.withRouting) {
    const routes =
      typeof config.withRouting === "boolean" ? [] : config.withRouting.routes;
    providers.push(provideRouter(routes));
  }

  TestBed.configureTestingModule({
    imports,
    providers,
  });

  if (config?.componentProviders) {
    TestBed.overrideComponent(componentClass, {
      add: {
        providers: config.componentProviders,
      },
    });
  }

  if (config?.withRouting) {
    const routerHarness = await RouterTestingHarness.create(
      typeof config.withRouting === "boolean"
        ? undefined
        : config.withRouting.initialRoute,
    );
    renderResult.routerHarness = routerHarness;
    renderResult.router = TestBed.inject(Router);
  }

  const bindings = Object.entries(config?.inputs ?? {}).map(([key, value]) =>
    inputBinding(key, () => value),
  );
  const fixture = TestBed.createComponent(componentClass, {
    bindings,
  });
  fixture.autoDetectChanges();
  await fixture.whenStable();

  const component = page.elementLocator(fixture.nativeElement);

  return {
    ...renderResult,
    fixture,
    componentClassInstance: fixture.componentInstance,
    component,
  };
}

export function cleanup(shouldTeardown = false) {
  return getCleanupHook(shouldTeardown)();
}
