import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/services/product/product.service';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-brands-overview',
  standalone: true,
  imports: [
      CommonModule,
      FormsModule,
      MatPaginatorModule,],
  templateUrl: './brands-overview.component.html',
  styleUrls: []
})
export class BrandsOverviewComponent {
  messageType: 'success' | 'error' = 'success'; // default
  errorMessage = '';
  showErrorBox = false;
  timeoutId: any;
  newBrand:String='';
  brands :any[]=[];
  isUpdate:boolean = false;
  brandId : string=''; 
  pagedBrands: any[] = []; // slice for current page
  pageSize = 5;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private productService:ProductService){}
  ngOnInit(){
    this.getBrands();    
  }
  getBrands(){
    this.productService.getBrands().subscribe((data:any)=>{
      console.log(data);
      this.brands = data;
      this.updatePagedBrands();
    })
    
  }
  addBrands(){
     const brand = {
      name: this.newBrand,
    };
    this.productService.addBrand(brand).subscribe({
        next:(result:any)=>{
             this.showMessage(result.message, false);
         },
         error:(error) =>{
           this.showMessage(error.message, true);
         }
       })
       
       this.getBrands();
  }  
  updateBrand(brand:any){
      this.isUpdate = true;
       this.newBrand = brand.name;
       this.brandId = brand._id;
  }
  saveUpdateBrand(){
        const updateBrand = {
         name: this.newBrand,
        };
       this.productService.updateBrand(this.brandId,updateBrand).subscribe({
        next:(result:any)=>{
             this.showMessage(result.message, false);
         },
         error:(error) =>{
           this.showMessage(error.message, true);
         }
       })
       this.newBrand='';
       this.brandId='';
       this.isUpdate=false;
       this.getBrands();
  }
  deleteBrands(brand:any){
    this.productService.deleteBrand(brand._id).subscribe({
       next:(result:any)=>{
             this.showMessage(result.message, false);
         },
         error:(error) =>{
           this.showMessage(error.message, true);
         }
    });    
     this.getBrands();
  }
  trackByBrandsId(brand:any):number {
    return brand._id; // unique identifier
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedBrands();
  }

  updatePagedBrands() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedBrands = this.brands.slice(startIndex, endIndex);
  }
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
