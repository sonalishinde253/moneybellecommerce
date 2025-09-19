import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-tree.component.html',
  styleUrls: []
})
export class CategoryTreeComponent {
 @Input() categories: any[] = [];
 @Output() categorySelected = new EventEmitter<any>();

  selectedCategories: string[] = [];

  toggleExpand(cat: Category) {
     cat.expanded = !cat.expanded;
  }
 toggleSelection(cat: Category, event: any) {       
    cat.selected = event.target.checked? true : false;
    if (cat.children?.length) {
    this.setChildrenSelected(cat.children, cat.selected);
  }
  // ✅ after any change, recalc selected IDs
  const selectedIds = this.getAllSelectedIds(this.categories);
  this.categorySelected.emit(selectedIds);
 }
 private setChildrenSelected(children: Category[], selected: boolean) {
  for (let child of children) {
    child.selected = selected;
    if (child.children?.length) {
      this.setChildrenSelected(child.children, selected);
    }
  }
}
private getAllSelectedIds(categories: Category[]): string[] {
  let ids: string[] = [];
  for (let c of categories) {
    if (c.selected) {
      // include this category AND all its children
      ids.push(c._id);
      if (c.children?.length) {
        ids = ids.concat(this.getAllIdsRecursive(c.children));
      }
    } else if (c.children?.length) {
      // check deeper for selected children
      ids = ids.concat(this.getAllSelectedIds(c.children));
    }
  }
  return ids;
}

// helper to collect *all* IDs under a category (for parent selection)
private getAllIdsRecursive(categories: Category[]): string[] {
  let ids: string[] = [];
  for (let c of categories) {
    ids.push(c._id);
    if (c.children?.length) {
      ids = ids.concat(this.getAllIdsRecursive(c.children));
    }
  }
  return ids;
}


  private updateChildren(children: Category[], checked: boolean) {
    children.forEach(c => {
      c.selected = checked;
      if (checked) {
        if (!this.selectedCategories.includes(c._id)) {
          this.selectedCategories.push(c._id);
        }
      } else {
        this.selectedCategories = this.selectedCategories.filter(id => id !== c._id);
      }
      if (c.children && c.children.length > 0) {
        this.updateChildren(c.children, checked);
      }
    });
  }
 
}