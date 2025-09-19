import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/services/category/category.service';
import { FormsModule } from '@angular/forms';
import { Category } from 'src/app/interfaces/category';
import { CategoryTreeComponent } from './category-tree/category-tree/category-tree.component';

@Component({
  selector: 'app-category-overview',
  standalone: true,
  imports: [CommonModule,FormsModule,CategoryTreeComponent],
  templateUrl: './category-overview.component.html',
  styleUrls: []
})
export class CategoryOverviewComponent {
  categories: Category[] = [];
  categoryTree: Category[] = [];
  newCategory = { name: '', parent: '' };
  levels: { selected: string, options: Category[] }[] = [];
  newCategoryName: string = '';
  selectedParent: string = ''
  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.categories = res;
      this.levels = [{ selected: '', options: this.categories.filter(c => !c.parent) }];
      this.categoryTree = this.buildTree(res);
      console.log(this.categoryTree);
    });
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

  addCategory() {
    const payload = {
      name: this.newCategory.name,
      parent: this.selectedParent || null
    };
    console.log(payload);
    this.categoryService.addCategory(payload).subscribe((res) => {
      console.log(res);
      this.newCategory.name = '';
      this.selectedParent = '';
      this.loadCategories();
    });
  }
}
