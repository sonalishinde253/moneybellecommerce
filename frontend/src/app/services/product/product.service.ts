import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
 private API_URL = 'http://localhost:3000/api/products';
  private token = localStorage.getItem('token');
  private headers = {
  headers: {
    Authorization: `Bearer ${this.token}`
  }
}
  constructor(private http: HttpClient) { }

  getAllProducts(page: number | undefined = undefined, limit: number | undefined = undefined) {
    return this.http.get<Product[]>(
      `${this.API_URL}?page=${page}&limit=${limit}`,this.headers
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.API_URL}/${id}`,this.headers);
  }

  createProduct(product: any) {
    
  const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(this.API_URL, product, {headers} );
  }

  updateProduct(id: string, product: any) {
    console.log(this.token);
       const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put(`${this.API_URL}/${id}`, product,{headers});
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`,this.headers);
  }

  decreaseStock(products: { id: string; count: number }[]) {
     const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.API_URL}/decrease-stock`, { products,headers });
  }

  uploadProductImage(data: FormData) {
    console.log(data);
    return this.http.patch(`${this.API_URL}/updateImage`, data,this.headers);
  }

  getChartsProducts() {
    return this.http.get(`${this.API_URL}/product-counts-by-brand`,this.headers);
  }
  addBrand(data: any) { 
    return this.http.post(`${this.API_URL}/brand`, data);
   }
  getBrands() {
     return this.http.get(`${this.API_URL}/brands`,this.headers); 
    }
  updateBrand(id: string, data: any) { 
    return this.http.put(`${this.API_URL}/brand/${id}`, data); 
  }
  deleteBrand(id: string) { 
    return this.http.delete(`${this.API_URL}/brand/${id}`); 
  }

 
}
