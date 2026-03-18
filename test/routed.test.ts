import { Routes } from '@angular/router';
import { render } from '../src';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { HomeComponent } from './components/home.component';
import { RoutedComponent } from './components/routed.component';
import { UserProfileComponent } from './components/user-profile.component';
import { UserWithRouteParamComponent } from './components/routed.component';

test('should render routed component with routing', async () => {
  const { locator } = await render(RoutedComponent, {
    withRouting: true,
  });

  // Check that the component loads
  await expect.element(locator).toHaveTextContent('Routed Component');
  await expect.element(locator).toHaveTextContent('Home');
  await expect.element(locator).toHaveTextContent('About');
  await expect.element(locator).toHaveTextContent('Contact');
});

test('should render routed component with full routing configuration and navigate', async () => {
  const routes: Routes = [
    {
      path: '',
      component: RoutedComponent,
      children: [
        { path: 'home', component: HomeComponent },
        { path: 'about', component: AboutComponent },
        { path: 'contact', component: ContactComponent },
      ],
    },
  ];

  const { locator, router, componentClassInstance } = await render(
    RoutedComponent,
    {
      withRouting: {
        routes,
        initialRoute: '/home',
      },
    },
  );

  // Check that the component loads
  await expect.element(locator).toHaveTextContent('Routed Component');
  await expect.element(locator).toHaveTextContent('Home Page');

  // Navigate to about using router.navigate
  await router!.navigate(['/about']);
  await expect.element(locator).toHaveTextContent('About Page');
  expect(router?.url).toEqual('/about');

  // Navigate to contact using router.navigate
  await locator.getByRole('link', { name: 'Contact' }).click();
  await expect.element(locator).toHaveTextContent('Contact Page');
  expect(router?.url).toEqual('/contact');

  // Navigate back to home
  await router!.navigate(['/home']);
  await expect.element(locator).toHaveTextContent('Home Page');
  expect(router?.url).toEqual('/home');

  // Verify navigation count increased
  expect(componentClassInstance.navigationCount).toBeGreaterThan(0);
});

test('should have access to route params when rendered as routed component', async () => {
  const routes: Routes = [
    { path: 'user/:id', component: UserWithRouteParamComponent },
  ];

  const { componentClassInstance } = await render(UserWithRouteParamComponent, {
    withRouting: {
      routes,
      initialRoute: '/user/42',
    },
  });

  expect(componentClassInstance.userId).toBe('42');
});

test('should pass inputs via route data using withComponentInputBinding', async () => {
  const routes: Routes = [
    {
      path: 'profile',
      component: UserProfileComponent,
      data: {
        name: 'Jane Doe',
        age: 30,
        email: 'jane@example.com',
        isActive: true,
      },
    },
  ];

  const { locator, componentClassInstance } = await render(
    UserProfileComponent,
    {
      withRouting: {
        routes,
        initialRoute: '/profile',
      },
    },
  );

  // Verify inputs were bound from route data
  expect(componentClassInstance.name()).toBe('Jane Doe');
  expect(componentClassInstance.age()).toBe(30);
  expect(componentClassInstance.email()).toBe('jane@example.com');
  expect(componentClassInstance.isActive()).toBe(true);

  // Verify the component renders correctly with the data
  await expect
    .element(locator.getByRole('heading', { name: 'Jane Doe' }))
    .toBeVisible();
  await expect.element(locator.getByText('Age: 30')).toBeVisible();
  await expect
    .element(locator.getByText('Email: jane@example.com'))
    .toBeVisible();
  await expect.element(locator.getByText('Status: Active')).toBeVisible();
});

test('should NOT bind route data to inputs when disableInputBinding is true', async () => {
  const routes: Routes = [
    {
      path: 'profile',
      component: UserProfileComponent,
      data: {
        name: 'Jane Doe',
        age: 30,
        email: 'jane@example.com',
        isActive: true,
      },
    },
  ];

  const { locator, componentClassInstance } = await render(
    UserProfileComponent,
    {
      withRouting: {
        routes,
        initialRoute: '/profile',
        disableInputBinding: true,
      },
    },
  );

  // Verify inputs were NOT bound - they should have default values
  expect(componentClassInstance.name()).toBe('Guest');
  expect(componentClassInstance.age()).toBe(0);
  expect(componentClassInstance.email()).toBe('');
  expect(componentClassInstance.isActive()).toBe(false);

  // Verify the component renders with default values
  await expect
    .element(locator.getByRole('heading', { name: 'Guest' }))
    .toBeVisible();
  await expect.element(locator.getByText('Age: 0')).toBeVisible();
  await expect.element(locator.getByText('Status: Inactive')).toBeVisible();
});
