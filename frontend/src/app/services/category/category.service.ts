import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http:HttpClient){}
  private apiUrl = 'http://localhost:3000/api/categories';
  private token = localStorage.getItem('token');
  private headers = {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }
  getCategories() {
     return this.http.get(`${this.apiUrl}`,this.headers);
  }

  addCategory(category: any) {
    return this.http.post(`${this.apiUrl}`, category,this.headers);
  }
  getCategoryById(catId:any){
    return this.http.get(`${this.apiUrl}/${catId}`,this.headers);
  }
}