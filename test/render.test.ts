import { render } from '../src';
import { HelloWorldComponent } from './components/hello-world.component';
import { ProductComponent } from './components/product.component';
import { UserProfileComponent } from './components/user-profile.component';

test('render', async () => {
  const { component } = await render(HelloWorldComponent);
  await expect.element(component).toHaveTextContent('Hello World');
});

test('render with inputs (signal-based)', async () => {
  const { component } = await render(UserProfileComponent, {
    inputs: {
      name: 'Jane Doe',
      age: 30,
      email: 'jane@example.com',
      isActive: true,
    },
  });

  await expect
    .element(component.getByRole('heading', { name: 'Jane Doe' }))
    .toBeVisible();
  await expect.element(component.getByText('Age: 30')).toBeVisible();
  await expect
    .element(component.getByText('Email: jane@example.com'))
    .toBeVisible();
  await expect.element(component.getByText('Status: Active')).toBeVisible();
  await expect
    .element(component.getByText('Jane Doe (30 years old) - jane@example.com'))
    .toBeVisible();
});

test('render with inputs (@Input decorator)', async () => {
  const { component } = await render(ProductComponent, {
    inputs: {
      name: 'Laptop',
      price: 1299.99,
      inStock: true,
      category: 'Electronics',
    },
  });

  await expect
    .element(component.getByRole('heading', { name: 'Laptop' }))
    .toBeVisible();
  await expect.element(component.getByText('Price: $1299.99')).toBeVisible();
  await expect.element(component.getByText('In Stock: Yes')).toBeVisible();
  await expect
    .element(component.getByText('Category: Electronics'))
    .toBeVisible();
});
