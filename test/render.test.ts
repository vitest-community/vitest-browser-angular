import { signal } from '@angular/core';
import { render } from '../src';
import { HelloWorldComponent } from './components/hello-world.component';
import { ProductComponent } from './components/product.component';
import { UserProfileComponent } from './components/user-profile.component';

test('render', async () => {
  const { locator } = await render(HelloWorldComponent);
  await expect.element(locator).toHaveTextContent('Hello World');
});

test('render with inputs (signal-based)', async () => {
  const { locator } = await render(UserProfileComponent, {
    inputs: {
      name: 'Jane Doe',
      age: 30,
      email: 'jane@example.com',
      isActive: true,
    },
  });

  await expect
    .element(locator.getByRole('heading', { name: 'Jane Doe' }))
    .toBeVisible();
  await expect.element(locator.getByText('Age: 30')).toBeVisible();
  await expect
    .element(locator.getByText('Email: jane@example.com'))
    .toBeVisible();
  await expect.element(locator.getByText('Status: Active')).toBeVisible();
  await expect
    .element(locator.getByText('Jane Doe (30 years old) - jane@example.com'))
    .toBeVisible();
});

test('render with inputs (@Input decorator)', async () => {
  const { locator } = await render(ProductComponent, {
    inputs: {
      name: 'Laptop',
      price: 1299.99,
      inStock: true,
      category: 'Electronics',
    },
  });

  await expect
    .element(locator.getByRole('heading', { name: 'Laptop' }))
    .toBeVisible();
  await expect.element(locator.getByText('Price: $1299.99')).toBeVisible();
  await expect.element(locator.getByText('In Stock: Yes')).toBeVisible();
  await expect
    .element(locator.getByText('Category: Electronics'))
    .toBeVisible();
});

test('render with outputs', async () => {
  const sendHandler = vi.fn();
  const { locator } = await render(UserProfileComponent, {
    outputs: {
      send: sendHandler,
    },
  });
  await locator.getByRole('button', { name: 'Send' }).click();
  expect(sendHandler).toHaveBeenCalled();
});

test('render with dynamic inputs signal', async () => {
  const name = signal('John Doe');
  const { locator } = await render(UserProfileComponent, {
    inputs: {
      name,
    },
  });
  await expect
    .element(locator.getByRole('heading', { name: 'John Doe' }))
    .toBeVisible();
  name.set('Jane Smith');
  await expect
    .element(locator.getByRole('heading', { name: 'Jane Smith' }))
    .toBeVisible();
});
