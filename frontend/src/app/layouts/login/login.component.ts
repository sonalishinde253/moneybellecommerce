import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
   AbstractControl,
   FormBuilder,
   FormGroup, 
   ReactiveFormsModule, 
   ValidationErrors, 
   ValidatorFn, 
   Validators 
} from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  loginForm!:FormGroup;
  showPassword:boolean = false;
  errorMessage = '';
  showErrorBox = false;
  timeoutId: any;
  constructor(private router:Router,private fb:FormBuilder,private user:UserService){
  
  }
  ngOnInit(){
    this.loginForm = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',[Validators.required,Validators.minLength(8),
                    this.passwordStrengthValidator()]],
       rememberMe: [false]
    })
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(){
   if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }else{
      
      console.log(this.loginForm.value);
      const formData = {
        email : this.loginForm.value.email,
        password : this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      } 
      // console.log(formData);
      this.user.login(formData).subscribe({
        next:((response)=>{
          console.log(response.token);
          //  if (response.token) {
          //     if (this.loginForm.value.rememberMe) {
                localStorage.setItem('token', response.token);  // persistent
              // } else {
                // sessionStorage.setItem('token', response.token); // until browser closed
              // }
            // }
         console.log('Login successful:', response);
           this.errorMessage = '';           
        this.showErrorBox = false;
          // localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role);
          if (localStorage.getItem('role') == 'admin') {
            window.location.href = '/admin-dashboard/overview';
          } else this.router.navigate(['/home']);       
        }),
        error:((error)=>{
          if (error.status === 401) {
              this.showError('Incorrect Email or Password.');
          } else {
              this.showError('Something went wrong. Please try again.');
          }
        }),
      });
  }
}

private showError(message: string) {
    this.errorMessage = message;
    this.showErrorBox = true;

    if (this.timeoutId) clearTimeout(this.timeoutId);

    // auto-hide after 5 seconds
    this.timeoutId = setTimeout(() => {
      this.showErrorBox = false;
    }, 5000);
  }
   closeError() {
    this.clearError();
  }

  private clearError() {
    this.errorMessage = '';
    this.showErrorBox = false;
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
forgotPassword(){
  this.router.navigate(['/forgot-password']);
}
   // Custom synchronous validator: password strength example
    private passwordStrengthValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value || '';
        if (!value) return null;
  
        const hasUpper = /[A-Z]/.test(value);
        const hasLower = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const valid = hasUpper && hasLower && hasNumber && hasSpecial;
        return valid ? null : { weakPassword: true };
      };
    }
  
  signup(){
    this.router.navigate(['signup']);
  }
}
