import { Directive, input, output } from '@angular/core';

@Directive({
  selector: '[test]',
  host: {
    '[class]': 'className()',
    '(blur)': 'blurred.emit($event)',
  },
})
export class ChangeClass {
  className = input<string>();
  blurred = output<FocusEvent>();
}
