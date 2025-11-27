import { beforeEach } from "vitest";
import { page } from "vitest/browser";
import { cleanup, render } from "./pure";
export type { RenderFn, RenderResult } from "./pure";
export { cleanup, render };

page.extend({
  render,
  [Symbol.for("vitest:component-cleanup")]: cleanup,
});

beforeEach(async () => {
  await cleanup(true);
});

declare module "vitest/browser" {
  interface BrowserPage {
    render: typeof render;
  }
}
