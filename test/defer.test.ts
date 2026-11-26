import { render } from '../src';
import {
  DeferredComponent,
  DeferredGreetingService,
} from './components/deferred.component';

const componentProviders = [
  {
    provide: DeferredGreetingService,
    useValue: { greeting: 'Hello from componentProviders' },
  },
];

describe('component with a lazy @defer dependency (AOT)', () => {
  test('renders with componentProviders', async () => {
    const { locator } = await render(DeferredComponent, {
      componentProviders,
    });

    await expect
      .element(locator.getByTestId('greeting'))
      .toHaveTextContent('Hello from componentProviders');
    await expect
      .element(locator.getByTestId('deferred'))
      .toHaveTextContent('Deferred content');
  });

  test('renders with componentProviders and routing', async () => {
    const { locator } = await render(DeferredComponent, {
      componentProviders,
      withRouting: true,
    });

    await expect
      .element(locator.getByTestId('greeting'))
      .toHaveTextContent('Hello from componentProviders');
    await expect
      .element(locator.getByTestId('deferred'))
      .toHaveTextContent('Deferred content');
  });
});
