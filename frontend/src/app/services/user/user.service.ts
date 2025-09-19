import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:3000/api/users";
 private token = localStorage.getItem('token');
  private headers = {
  headers: {
    Authorization: `Bearer ${this.token}`
  }
}
  constructor(private http:HttpClient) { }
  
  login(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,data).pipe(
      catchError(this.handleError)
    )
  }
 
  signup(data:any):Observable<any>{    
    return this.http.post(`${this.apiUrl}/signup`,data).pipe(
      catchError(this.handleError)
    )
  }
   forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgotPassword`, data).pipe(
      // Handle any errors
      catchError(this.handleError)
    );
  }
 // Reset password with the provided reset token
  resetPassword(newPassword: string, resetToken: string): Observable<any> {
    const data = {
      password: newPassword,
      passwordConfirm: newPassword,
      resetToken: resetToken,
    };
    return this.http
      .patch(`${this.apiUrl}/resetPassword/${resetToken}`, data)
      .pipe(catchError(this.handleError));
  }

   getAllUsers() {
    return this.http
      .get(`${this.apiUrl}/all`,this.headers)
      .pipe(catchError(this.handleError));
  }
    getCartSize(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/size`,this.headers).pipe(
      catchError(this.handleError)
    );
  }
  addCart(data: any): Observable<any> {
    console.log('id ' + data);
    const product = { productId: data };
    return this.http.post(`${this.apiUrl}/cart`, product,this.headers).pipe(
      // Handle any errors
      catchError(this.handleError)
    );
  }
  getCart(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`,this.headers).pipe(
      // Handle any errors
      catchError(this.handleError)
    );
  }
  deleteCart(data: any): Observable<any> {
    console.log('id ' + data);
    const product = { productId: data.productId, type: data.type };
    return this.http.post(`${this.apiUrl}/cart/delete`, product).pipe(
      // Handle any errors
      catchError(this.handleError)
    );
  }
  private handleError(error:HttpErrorResponse){
      if(error.error instanceof ErrorEvent)
         console.error('Client-side error:', error.error.message);
      else
        console.log(`Server-side error:${error.status} - ${error.message}`);
      return throwError(error);//`An error occurred while trying to Handle request Please try again later.`)
  }
  public isAdmin(): Boolean {
    let role = localStorage.getItem('role');
    console.log(role);
    if (role == 'admin') {
      return true;
    } else {
      return false;
    }
  }
  public isLoggedIn(): Boolean {
    let IsLoggedInUser = localStorage.getItem('token');
    console.log(IsLoggedInUser);
    if (IsLoggedInUser != null) {
      return true;
    } else {
      return false;
    }
  }
   
}
