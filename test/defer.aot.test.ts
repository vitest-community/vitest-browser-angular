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
  test.each([
    { name: 'renders with componentProviders', withRouting: false },
    {
      name: 'renders with componentProviders and routing',
      withRouting: true,
    },
  ])('$name', async ({ withRouting }) => {
    const { locator } = await render(DeferredComponent, {
      componentProviders,
      withRouting,
    });

    await expect
      .element(locator.getByTestId('greeting'))
      .toHaveTextContent('Hello from componentProviders');
    await expect
      .element(locator.getByTestId('deferred'))
      .toHaveTextContent('Deferred content');
  });
});
