import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private token = localStorage.getItem('token');
  private readonly API_URL: string = 'http://localhost:3000/api/profile';
  private headers = {
  headers: {
    Authorization: `Bearer ${this.token}`
  }
}
//  const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('token')}`
//     });

  constructor(private http: HttpClient) {

  }

  getAllProfile() {
    return this.http.get(this.API_URL + '/all',this.headers);
  }

  getProfile() {
    console.log(this.headers);
    return this.http.get(this.API_URL + '/view',this.headers);
  }

  updateProfile(data: any) {
    return this.http.patch(this.API_URL + '/edit', data,this.headers);
  }

  adminUpdateProfile(data: any) {
    return this.http.patch(this.API_URL + '/admin/edit', data,this.headers);
  }

  updatePassword(data: any) {
    return this.http.patch(this.API_URL + '/password', data,this.headers);
  }
  updateImage(data: any) {
    const formData = new FormData();
    formData.append('image', data);
    return this.http.patch(this.API_URL + '/updateImage', formData,this.headers);
  }
  getUsersCharts() {
    return this.http.get(this.API_URL + '/charts',this.headers);
  }
  adminUpdateImage(data: any, username?: string) {
    const formData = new FormData();
    formData.append('image', data);
    if (username) {
      formData.append('username', username);
    }
    return this.http.patch(this.API_URL + '/admin/updateImage', formData,this.headers);
  }
  adminDeleteUser(username: string) {
     const headers = new HttpHeaders({
      'Authorization':  `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    const body = {
     username: username 
    };
    return this.http.delete(this.API_URL + '/admin/delete', { body,headers});
  }
}
