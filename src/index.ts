import { beforeEach } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render, renderDirective } from "./pure";
export type { Inputs, RenderConfig, RenderFn, RenderResult } from "./pure";
export { cleanup, render, renderDirective };

page.extend({
  render,
  renderDirective,
  [Symbol.for("vitest:component-cleanup")]: cleanup,
});

beforeEach(async () => {
  await cleanup(true);
});

declare module "vitest/browser" {
  interface BrowserPage {
    render: typeof render;
    renderDirective: typeof renderDirective;
  }
}
