import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Brand {
  _id: string;
  name: string;
  selected?: boolean;
}
@Component({
  selector: 'app-brand-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brand-filter.component.html',
  styleUrls: ['./brand-filter.component.css']
})
export class BrandFilterComponent {
 @Input() brands: Brand[] = [];
 @Output() brandSelected = new EventEmitter<any[]>();

  toggleBrand(brand: Brand, event: any) {
    // console.log(brand);
    console.log(this.brands)
    brand.selected = event.target.checked;
    console.log(brand);
    const selectedIds = this.brands.filter(b => b.selected).map(b => b._id);
    console.log(selectedIds);
    this.brandSelected.emit(selectedIds);
  }
}