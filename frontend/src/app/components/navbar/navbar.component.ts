import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { ProductService } from 'src/app/services/product/product.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit{
  toggleBurgerMenu = false;
  category : Category[]=[];
  constructor(private router : Router,private categoryService:CategoryService){}
  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((res:any)=>{
      this.category = res;
    })
  }
  toggleMenu(){
    this.toggleBurgerMenu = !this.toggleBurgerMenu;
  }
  isLoggedIn(): boolean {
    if(localStorage.getItem('token')|| sessionStorage.getItem('token'))
      return true;
    else
      return false;
  }
  logout(){
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  }
}
