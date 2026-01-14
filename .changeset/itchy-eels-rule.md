---
'vitest-browser-angular': minor
---

FEAT: decorated render result with element locators (which start with the baseElement)

Now you can do this:

```ts
test('renders component with service provider', async () => {
  const screen = await render(HelloWorldComponent);
  await expect.element(screen.getByText('Hello World')).toBeVisible(); // uses the baseElement as the root element for the query selector
});
```
