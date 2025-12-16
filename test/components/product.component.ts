import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  template: `
    <div class="product">
      <h2>{{ name }}</h2>
      <p class="price">Price: {{ '$' + price }}</p>
      <p class="stock">In Stock: {{ inStock ? 'Yes' : 'No' }}</p>
      <p class="category">Category: {{ category }}</p>
    </div>
  `,
})
export class ProductComponent {
  @Input() name = 'Unknown Product';
  @Input() price = 0;
  @Input() inStock = false;
  @Input() category = 'General';
}
