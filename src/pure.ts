import type { EnvironmentProviders, Provider, Type } from "@angular/core";
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

export interface RenderConfig {
  withRouting?: RoutingConfig | boolean;
  providers?: Array<Provider | EnvironmentProviders>;
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
  config?: RenderConfig,
) => Promise<RenderResult<T>>;

export async function render<T>(
  componentClass: Type<T>,
  config?: RenderConfig,
) {
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

  if (config?.withRouting) {
    const routerHarness = await RouterTestingHarness.create(
      typeof config.withRouting === "boolean"
        ? undefined
        : config.withRouting.initialRoute,
    );
    renderResult.routerHarness = routerHarness;
    renderResult.router = TestBed.inject(Router);
  }
  const fixture = TestBed.createComponent(componentClass);
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

export function cleanup(shouldTearndown: boolean = false) {
  return getCleanupHook(shouldTearndown)();
}
