import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { DialogMessageService } from 'src/app/services/dialog-message/dialog-message.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterModule, LoadingSpinnerComponent],
  templateUrl: './product-form.component.html',
  styles: []
})
export class ProductFormComponent implements OnInit {
  categories: Category[] = [];
  selectedFiles: File[] = [];
  formData: any;
  isLoading = false;
  newCategory = { name: '', parent: '' };
  levels: { selected: string, options: Category[] }[] = [];
  newCategoryName: string = '';
  selectedParent: string = '';
  brands:any[]=[];
  constructor(
    private productService: ProductService, 
    public dialog: MatDialog,
    private categoryService:CategoryService,
    private dialogMessageService:DialogMessageService) {

    this.formData = new FormData();

  }

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    oldprice: new FormControl(0, [Validators.required, Validators.min(0)]),
    desc: new FormControl('', [Validators.required]),
    stock: new FormControl(0, [Validators.required, Validators.pattern("^[0-9]*$")]), // Ensure only numbers
    images: new FormControl([], [Validators.required]),
    brand: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    size: new FormControl(''),
    colors: new FormControl(''),
  });

  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
    this.selectedFiles.forEach((file, index) => {
      this.formData.append('images', file);
    });     
  }

  ngOnInit(){
    this.loadCategories();
    this.loadBrands();
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
      this.levels = [{ selected: '', options: this.categories.filter(c => !c.parent) }];
 
    });
  }

  loadBrands() {
    this.productService.getBrands().subscribe((res: any) => {
      console.log(res);
      this.brands = res;
    });
  }
  onSelect(levelIndex: number) {
    const selectedId = this.levels[levelIndex].selected;
    // cut deeper levels
    this.levels = this.levels.slice(0, levelIndex + 1);

    if (selectedId) {
      const children = this.categories.filter(c => c.parent && c.parent._id === selectedId);
      if (children.length > 0) {
        this.levels.push({ selected: '', options: children });
      }
      this.selectedParent = selectedId; // latest parent
    } else {
      this.selectedParent = ''; // means root
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.formData.append("name", this.productForm.value.name ?? '');
    this.formData.append("price", String(this.productForm.value.price ?? 0));
    this.formData.append("oldprice", String(this.productForm.value.oldprice ?? 0));
    this.formData.append("brand", this.productForm.value.brand ?? '');
    this.formData.append("colors", this.productForm.value.colors ?? '');
    this.formData.append("desc", this.productForm.value.desc ?? '');
    this.formData.append("size", this.productForm.value.size ?? '');
    this.formData.append("stock", String(this.productForm.value.stock ?? 0));
    this.formData.append("category",  this.selectedParent?? '');

    this.productService.createProduct(this.formData).subscribe({
      next: (data: any) => {
            this.isLoading = false;
            this.isLoading = false;
             this.dialogMessageService.sendMessage({
                 message: data.message || 'Product updated successfully!',
                isError: false
            });
          this.dialog.closeAll(); // ✅ close dialogs after sending message
        },
        error: (error) => {
            this.isLoading = false;
            this.dialogMessageService.sendMessage({
              message: error.error?.message || 'Something went wrong',
              isError: true
            });
          this.dialog.closeAll();
        }
    });
  }
  closeForm(){
    this.dialog.closeAll();
  }
}
