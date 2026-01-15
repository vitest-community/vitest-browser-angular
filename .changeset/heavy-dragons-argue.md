---
'vitest-browser-angular': minor
---

FEAT: return `container` element

Now you can access the component's host element via the `container` property.
This is basically a shortcut for `fixture.nativeElement`.

```ts
test('renders component with service provider', async () => {
  const { container, fixture } = await render(HelloWorldComponent);

  expect(container).toBe(fixture.nativeElement);
});
```
