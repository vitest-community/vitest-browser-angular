import { render } from '../src';
import {
  CustomGreetingService,
  GreetingService,
  ServiceConsumerComponent,
} from './components/service-consumer.component';

describe('componentProviders', () => {
  test('renders component with default service provider', async () => {
    const { component } = await render(ServiceConsumerComponent, {
      componentProviders: [GreetingService],
    });

    await expect
      .element(component.getByTestId('greeting'))
      .toHaveTextContent('Hello, World!');
    await expect
      .element(component.getByTestId('message'))
      .toHaveTextContent('This component uses injected services');
  });

  test('renders component with custom service provider', async () => {
    const { component } = await render(ServiceConsumerComponent, {
      componentProviders: [
        {
          provide: GreetingService,
          useClass: CustomGreetingService,
        },
      ],
    });

    await expect
      .element(component.getByTestId('greeting'))
      .toHaveTextContent('Welcome, World! Nice to see you.');
    await expect
      .element(component.getByTestId('message'))
      .toHaveTextContent('This component uses injected services');
  });

  test('renders component with factory provider', async () => {
    const { component } = await render(ServiceConsumerComponent, {
      componentProviders: [
        {
          provide: GreetingService,
          useFactory: () => ({
            getGreeting: (name: string) => `Hey ${name}, what's up?`,
          }),
        },
      ],
    });

    await expect
      .element(component.getByTestId('greeting'))
      .toHaveTextContent("Hey World, what's up?");
  });

  test('renders component with value provider', async () => {
    const mockService = {
      getGreeting: (name: string) => `Greetings, ${name}!`,
    };

    const { component } = await render(ServiceConsumerComponent, {
      componentProviders: [
        {
          provide: GreetingService,
          useValue: mockService,
        },
      ],
    });

    await expect
      .element(component.getByTestId('greeting'))
      .toHaveTextContent('Greetings, World!');
  });
});
