import { Routes } from '@angular/router';
import { render } from '../src';
import { AboutComponent } from './components/about.component';
import { ContactComponent } from './components/contact.component';
import { HomeComponent } from './components/home.component';
import { RoutedComponent } from './components/routed.component';

test('should render routed component with routing', async () => {
  const { component } = await render(RoutedComponent, {
    withRouting: true,
  });

  // Check that the component loads
  await expect.element(component).toHaveTextContent('Routed Component');
  await expect.element(component).toHaveTextContent('Home');
  await expect.element(component).toHaveTextContent('About');
  await expect.element(component).toHaveTextContent('Contact');
});

test('should render routed component with full routing configuration and navigate', async () => {
  const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
  ];

  const { component, router, componentClassInstance } = await render(
    RoutedComponent,
    {
      withRouting: {
        routes,
        initialRoute: '/home',
      },
    },
  );

  // Check that the component loads
  await expect.element(component).toHaveTextContent('Routed Component');
  await expect.element(component).toHaveTextContent('Home Page');

  // Navigate to about using router.navigate
  await router!.navigate(['/about']);
  await expect.element(component).toHaveTextContent('About Page');
  expect(router?.url).toEqual('/about');

  // Navigate to contact using router.navigate
  await component.getByRole('link', { name: 'Contact' }).click();
  await expect.element(component).toHaveTextContent('Contact Page');
  expect(router?.url).toEqual('/contact');

  // Navigate back to home
  await router!.navigate(['/home']);
  await expect.element(component).toHaveTextContent('Home Page');
  expect(router?.url).toEqual('/home');

  // Verify navigation count increased
  expect(componentClassInstance.navigationCount).toBeGreaterThan(0);
});
