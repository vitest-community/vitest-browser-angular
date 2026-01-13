---
'vitest-browser-angular': minor
---

FEAT: component providers

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
  const { component } = await render(ServiceConsumerComponent, {
    componentProviders: [
      { provide: GreetingService, useClass: FakeGreetingService },
    ],
  });
});
```
