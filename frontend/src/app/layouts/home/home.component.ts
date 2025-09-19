import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Splide from '@splidejs/splide';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product/product.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit{
  constructor(private pService: ProductService){}
    allProducts: Product[] = [];
    displayedProducts:Product[] = [];    
    currentPage = 0;
    pageSize = 10;
    isLoading = false;
    private splide!: Splide;

    ngOnInit(){
      this.loadProducts();
    }
    initSplide() {
      if (this.splide) {
        this.splide.destroy();
      }
      this.splide = new Splide('#product-splide', {
        type: 'loop',   // ✅ Important: makes it slide continuously
        perPage: 4,
        gap: '1rem',
        autoplay: true,
        pagination: false,
        arrows: true,
        breakpoints: {
          1024: { perPage: 2 },
          640: { perPage: 1 },
        },
      });
      this.splide.mount();
    }

    ngOnDestroy() {
      if (this.splide) {
        this.splide.destroy();
      }
    }

    trackByProductId(index: number, product: any) {
      return product._id;
    }

    loadProducts(): void {
      this.isLoading = true;
      this.pService.getAllProducts().subscribe({
        next: (response: any) => {
          this.allProducts = response.totalProducts;
          this.displayedProducts = response.products;
          console.log(this.displayedProducts);
          setTimeout(() => this.initSplide(), 0);
          this.isLoading = false;
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle error
        },

      });
    }

}
