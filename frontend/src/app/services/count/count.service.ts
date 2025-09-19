import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CountService {
private product = new BehaviorSubject<number>(0);
  selectedProduct = this.product.asObservable();
  constructor(private userService: UserService) {
    this.setProduct();
  }
  setProduct() {
    this.userService.getCartSize().subscribe((data) => {
      this.product.next(data.data);
    });
  }
}