import { Component,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product/product.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ProductEditFormComponent } from '../product-edit-form/product-edit-form.component';
import { ProductFormComponent } from '../product-form/product-form.component';
import { DialogMessageService } from 'src/app/services/dialog-message/dialog-message.service';
import { ConfirmationDialogComponent } from '../user-deletion-confirmation/user-deletion-confirmation.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-products-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    LoadingSpinnerComponent,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    ReactiveFormsModule,  
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [ProductService],
  templateUrl: './products-overview.component.html',
   styleUrls: []
})
export class ProductsOverviewComponent {
  errorMessage = '';
  showErrorBox = false;
  timeoutId: any;
  allProducts: Product[] = [];
  displayedProducts: Product[] = [];
  currentPage = 0;
  pageSize = 5;
  isLoading = false;
  create = true;
  searchForm: FormGroup;
  searchValue = '';
  searchResults: string[] = [];
  proudctFilter: Product[] = [];
  products: Product[] = [];
  totalProducts = 0; 
  // dataSource = new MatTableDataSource<Product>(this.displayedProducts);
   @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private dialogMessageService:DialogMessageService,
    private pService: ProductService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: ['', Validators.required],
    });
     this.dialogMessageService.message$.subscribe(result => {
      if (result) {
        this.showMessage(result.message, result.isError);
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '100%',      // Full width on mobile
      maxWidth: '48rem',  // 448px max width
      panelClass: 'tailwind-dialog-panel', // optional for custom styling
      disableClose: false,
      // panelClass: 'mat-dialog-container-large',
      data: this.create,
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      this.loadProducts();
    })
  }
  trackByProductId(product: any): number {
    return product.id; // unique identifier
  }
  openEditDialog(product: any) {
    this.loadProducts();

    const editDialog = this.dialog.open(ProductEditFormComponent, {
      width: '100%',      // Full width on mobile
      maxWidth: '48rem',  // 448px max width
      panelClass: 'tailwind-dialog-panel', // optional for custom styling
      disableClose: false,
      data: { product }
    })
    editDialog.afterClosed().subscribe(result => {
      this.loadProducts();
    });
  }

  ngOnInit(): void {
   this.loadProducts();
  //  this.updateDisplayedProducts();
  }
  ngAfterViewInit() {
        // this.updateDisplayedProducts();
  }

  loadProducts(): void {
    // this.isLoading = true;
    this.pService.getAllProducts(this.currentPage + 1, this.pageSize).subscribe({
      next: (response: any) => {
        // 🔑 Adjust these based on your API response shape
        this.displayedProducts = response.products;        // the array of products
        this.totalProducts = response.totalProducts;        // total number of products in DB
        this.displayedProducts = response.products;
      },
      error: (err) => {
        console.error('Failed to load products', err);
      }
    
    });
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  deleteProduct(id: any,name:any) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: '100%',      // Full width on mobile
          maxWidth: '28rem',  // 448px max width
          panelClass: 'tailwind-dialog-panel', // optional for custom styling
          disableClose: false,
          data: { name: name,type:'Product' },
      });   
      dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.pService.deleteProduct(id).subscribe({
              next: (data: any) => {
                this.displayedProducts = this.displayedProducts.filter(
                  (prod) => prod._id != id
                );
                Swal.fire({
                  icon: 'success',
                  title: 'Deleted!',
                  text: 'Product Deleted Successfully',
                });
              },
              error: (error) => {
                console.error('Error deleting product:', error);
              },
            });
          }
          this.loadProducts();
        });
  }



  // part of search
  search() {
    if (this.searchForm.valid) {
      this.searchValue = this.searchForm.value.search;
      this.pService.getAllProducts().subscribe({
        next: (data: any) => {
          this.products = data.products;
          this.proudctFilter = this.filterProducts(this.searchValue);
          this.displayedProducts = this.proudctFilter;
        },
        error: (error) => {
          console.error('404 Not Found');
        },
      });
    } else this.loadProducts();
  }
  emptySearch() {
    this.searchForm.reset();
    this.proudctFilter = [];
  }
  // Function to perform the search (replace with actual search logic)
  filterProducts(term: string): Product[] {
    return this.products.filter((result) =>
      result.name.toLowerCase().includes(term.toLowerCase())
    );
  }
  messageType: 'success' | 'error' = 'success'; // default

  private showMessage(message: string, isError: boolean) {
    this.errorMessage = message;
    this.messageType = isError ? 'error' : 'success';
    this.showErrorBox = true;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      this.showErrorBox = false;
    }, 5000);
  }

  closeMessage() {
    this.clearMessage();
  }

  private clearMessage() {
    this.errorMessage = '';
    this.showErrorBox = false;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
