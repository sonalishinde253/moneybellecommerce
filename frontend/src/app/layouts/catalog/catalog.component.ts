import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/product/product.service';
import { Product } from 'src/app/interfaces/product';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/interfaces/category';
import { CategoryTreeComponent } from 'src/app/components/category-overview/category-tree/category-tree/category-tree.component';
import { BrandFilterComponent } from 'src/app/components/brand-filter/brand-filter/brand-filter.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule,LoadingSpinnerComponent,ProductCardComponent,CategoryTreeComponent,BrandFilterComponent],
  templateUrl: './catalog.component.html',
  styleUrls: []
})
export class CatalogComponent {

  constructor(private productService: ProductService,private categoryService:CategoryService) { }
  selectedCategories: any[] = [];
  selectedCategory='';
  products: Product[] = [];
  checksCategory: string[] = [];
  checksBrand: string[] = [];
  filteredProducts: Product[] = [];
  minPrice = 0;
  maxPrice = 0;
  sizes = new Set<string>();
  colors = new Set<string>();
  sortToggle = false;
  isLoading = true;  
  categories: any[] = [];
  categoryTree : Category[]=[];
  brands: any[]=[];
  selectedBrands:any[]=[];
  ngOnInit(): void {
     this.productService.getBrands().subscribe((res:any)=>{
        this.brands = res;
        console.log(this.brands);
     })
     this.categoryService.getCategories().subscribe((res:any)=>{
         console.log(res);
         this.categories = res;   
         this.categoryTree = this.buildTree(res);
         console.log(this.categoryTree);
     })
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.filteredProducts = this.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("404 Not Found");
      }
    })
   }
  buildTree(categories: Category[]): Category[] {
      const map: { [key: string]: Category } = {};
      const roots: Category[] = [];
  
      // index categories
      categories.forEach(cat => {
        map[cat._id] = { ...cat, children: [] };
      });
  
      // build hierarchy
      categories.forEach(cat => {
        if (cat.parent) {
          map[cat.parent._id].children?.push(map[cat._id]);
        } else {
          roots.push(map[cat._id]);
        }
      });
      return roots;
    }

  onCategorySelected( ids: string[]) {
  this.selectedCategories = ids;
  console.log('Selected category IDs:', this.selectedCategories);
  this.filter();
  }

  onBrandSelected(ids: any[]) {
    console.log(ids);
    this.selectedBrands = ids;
    // this.filteredProducts = this.products.filter(prod => {
    //     return });
    this.filter();
  }

  getMinPriceFilter(priceInput: any) {
    this.minPrice = priceInput.target.value;
    this.filter();
  }

  getMaxPriceFilter(priceInput: any) {
    const maxVal = priceInput.target.value;
    if (maxVal > this.minPrice)
      this.maxPrice = maxVal;
    this.filter();
  }

  getSizeFilters(sizeVal: string) {
    if (this.sizes.has(sizeVal)) {
      this.sizes.delete(sizeVal);
    } else {
      this.sizes.add(sizeVal);
    }
    this.filter();
  }

  getColorFilters(colorVal: string) {
    if (this.colors.has(colorVal)) {
      this.colors.delete(colorVal);
    } else {
      this.colors.add(colorVal);
    }
    this.filter();
  }

  getSort(sortVal: string) {
    if (sortVal === "Asc") {
      this.filteredProducts = this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      this.filteredProducts = this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    this.sortToggle = false;
  }


  filter() {
    if (
       !this.selectedCategories.length &&
       !this.selectedBrands.length && 
       !this.maxPrice && !this.minPrice && 
       !this.sizes && !this.colors
      ) {
          this.filteredProducts = this.products; // Reset to all products
      }
    else {
    //   this.filteredProducts = this.products.filter(prod => {
    //     return ( !this.selectedCategories.length || this.selectedCategories.includes(prod.category) &&
    //       (!this.selectedBrands.length || this.selectedBrands.includes(prod.brand)) &&
    //       (!this.minPrice || prod.price >= this.minPrice) &&
    //       (!this.maxPrice || prod.price <= this.maxPrice) &&
    //       (!this.sizes.size || prod.size.some(size => this.sizes.has(size))) &&
    //       (!this.colors.size || prod.colors.some(color => this.colors.has(color)))
    //     );
    //   });
    //   // console.log("size ",this.filteredProducts);
    // }

        this.filteredProducts = this.products.filter(prod => {
        const categoryMatch = !this.selectedCategories.length || this.selectedCategories.includes(prod.category);
        const brandMatch = !this.selectedBrands.length || this.selectedBrands.includes(prod.brand);
        const minPrice = !this.minPrice || prod.price >= this.minPrice;
        const maxPrice = !this.maxPrice || prod.price <= this.maxPrice;
        const size = !this.sizes.size || prod.size.some(size => this.sizes.has(size));
        const colors = !this.colors.size || prod.colors.some(color => this.colors.has(color));
        return categoryMatch && brandMatch && minPrice && maxPrice && size && colors;
      });
    }
  }

}
