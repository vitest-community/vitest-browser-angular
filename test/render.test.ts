import { render } from '../src';
import { HelloWorldComponent } from './components/hello-world.component';

test('render', async () => {
  const { component } = await render(HelloWorldComponent);
  await expect.element(component).toHaveTextContent('Hello World');
});
