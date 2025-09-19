import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SimpleChanges } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Category } from 'src/app/interfaces/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { DialogMessageService } from 'src/app/services/dialog-message/dialog-message.service';

@Component({
  selector: 'app-product-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule,CommonModule, LoadingSpinnerComponent],
  templateUrl: './product-edit-form.component.html',
  styleUrls:[]
})
export class ProductEditFormComponent {
  showPassword:boolean = false;
  
  product: any = {};
  imagesUrl: any=[];
  selectedFiles: File[] = [];
  isLoading = false;
  categories: Category[] = [];
  formData: any;
  newCategory = { name: '', parent: '' };
  levels: { selected: string, options: Category[] }[] = [];
  newCategoryName: string = '';
  selectedParent: string = '';
  brands:any[]=[];
  constructor(
    private dialogMessageService:DialogMessageService,
    private productService: ProductService, 
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialog: MatDialog) {
      this.formData  = new FormData();
  }

  ngOnInit(): void {
    let { name, price,oldprice, images, desc, stock, brand, category, size, colors } = this.data.product;
    this.product = this.data.product;
    console.log(this.product);
    this.productForm.setValue({ name, price, oldprice,desc, stock, images, brand, category, size, colors })
    this.imagesUrl = images;
     
     this.loadCategories();
     this.loadBrands();
      this.productService.getProductById(this.product._id).subscribe({
      next: response => {
        this.product = response;
        this.imagesUrl = response.images;
         this.categoryService.getCategoryById(this.product.category).subscribe((cat: any) => {
        
          this.buildDropdownsFromCategory(cat); // ✅ now you have the full object
         });
      },
    })
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
  ngOnChanges(changes: SimpleChanges): void {
  
  }

  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    oldprice: new FormControl(0),
    desc: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]), // Ensure only numbers
    images: new FormControl([]),
    brand: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    size: new FormControl([]),
    colors: new FormControl([]),
  });
 buildDropdownsFromCategory(category: Category) {
    // Reset levels
    this.levels = [];

    // Step 1: Build the path chain (root -> child -> selected)
    const chain: Category[] = [];
    let current: any = category;
    while (current) {
      chain.unshift(current);
      current = current.parent;
    }
    // Step 2: Build levels dropdowns
    let parentId: string | null = null;
    chain.forEach((cat, index) => {

      const options = this.categories.filter(c => {
        if (!parentId) return !c.parent;
        return c.parent && c.parent._id === parentId;
      });
      this.levels.push({ selected: cat._id, options });
      parentId = cat._id;
    });
    // Step 3: Load children options for the selected category
    const children = this.categories.filter(c => c.parent && c.parent._id === category._id);
    if (children.length > 0) {
      this.levels.push({ selected: '', options: children });
    }
  }

  onSelect(levelIndex: number) {
    const selectedId = this.levels[levelIndex].selected;
    this.levels = this.levels.slice(0, levelIndex + 1);

    if (selectedId) {
      const children = this.categories.filter(c => c.parent && c.parent._id === selectedId);
      if (children.length > 0) {
        this.levels.push({ selected: '', options: children });
      }
      this.selectedParent  = selectedId;
      // this.product.category = selectedId;
   
    } 
  }

  removeImage(image: any) {
    this.imagesUrl = this.imagesUrl.filter((img: any) => img != image);
    this.productForm.value.images = this.imagesUrl;
    console.log(this.productForm.value.images);
  }

  onFileChange(event: any) {
    const files = event.target.files;
    this.selectedFiles = Array.from(files); 
    this.selectedFiles.forEach((file, index) => {
      this.formData.append('images', file);
    });
    console.log(this.selectedFiles);
  }

  uploadFiles() {
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
    if(this.imagesUrl.length > 0){
      this.formData.append('oldImages',this.imagesUrl);
    }
    this.productService.updateProduct(this.product._id,this.formData).subscribe({
        next: (data: any) => {
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
