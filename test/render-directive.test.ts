import { signal } from '@angular/core';
import { userEvent } from 'vitest/browser';
import { renderDirective } from '../src';
import { ChangeClass } from './directives/change-class';

test('renders directive', async () => {
  const className = signal('test');
  const { getByText, fixture } = await renderDirective(ChangeClass, {
    template: `<button test [className]="test()" (blurred)="onBlur($event)">Test</button>`,
    hostProps: {
      test: className,
    },
  });
  expect(getByText('Test')).toHaveClass('test');

  className.set('changed');
  await fixture.whenStable();
  await expect.element(getByText('Test')).toHaveClass('changed');
});

test('renders directive and emits outputs', async () => {
  const blurredSpy = vi.fn();
  const { getByText } = await renderDirective(ChangeClass, {
    template: `<button test (blurred)="onBlur($event)">Test</button>`,
    hostProps: {
      onBlur: blurredSpy,
    },
  });
  await userEvent.keyboard('{Tab}');
  await expect.element(getByText('Test')).toHaveFocus();
  await userEvent.keyboard('{Tab}');
  expect(blurredSpy).toHaveBeenCalled();
});
