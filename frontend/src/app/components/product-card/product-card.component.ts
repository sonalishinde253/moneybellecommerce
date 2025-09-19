import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user/user.service';
import Swal from 'sweetalert2';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { CountService } from 'src/app/services/count/count.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: []
})
export class ProductCardComponent {
 @Input() product: any;
  wishListBtn = false;

  constructor(
    private userService: UserService, 
    private localStorage: LocalStorageService, 
    private countService: CountService) { }

  ngOnInit(): void {
    let products: any = this.localStorage.getItem('wishList');
    if (this.product) {
      if (products && products.some((prod: any) => prod._id === this.product._id)) {
        this.wishListBtn = true;
      }
    }

  }

  addToCart() {
    console.log(this.product._id);
    if (!this.product.stock) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There is no enough quantity in the stock!',
      });
      return;
    }
    this.userService.addCart(this.product._id).subscribe({
      next: (data) => { this.countService.setProduct(); },
      error: (error) => console.error(error),
    });
    Swal.fire({
      icon: 'success',
      title: 'Great!',
      text: 'Product Added To Your Cart Successfully'
    })
  }

  addProductToWishList() {
    let products: any;
    if (this.localStorage.getItem('wishList')) {
      products = this.localStorage.getItem('wishList');
      if (products.some((prod: any) => prod._id === this.product._id)) {
        products = products.filter((prod: any) => prod._id !== this.product._id);
      } else {
        products.push(this.product)
      }
      this.localStorage.setItem('wishList', products);
    } else {
      products = [];
      products.push(this.product);
      this.localStorage.setItem('wishList', products);
    }
  }
}
