import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [],
  templateUrl: './delivery.component.html',
  styleUrls: [],
})
export class DeliveryComponent {
  @Output() isChecked: EventEmitter<any> = new EventEmitter();
}
