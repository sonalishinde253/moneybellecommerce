import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: []
})
export class SignupComponent implements OnInit {
  signupForm : FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(private router : Router,private fb:FormBuilder,private user:UserService){
    this.signupForm = this.fb.group({
      fullName :['',Validators.required],
      email : ['',[Validators.required,Validators.email]],
      username : ['',Validators.required],
      mobile : ['',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
      password : ['',[Validators.required,Validators.minLength(8),this.passwordStrengthValidator()]],
      termsAndCondition:[false,Validators.requiredTrue],
      confirmPassword: ['',Validators.required]},
      { validators: this.passwordsMatchValidator('password', 'confirmPassword')  },      
    );  
  }
 
  ngOnInit(): void {
    
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
   onSubmit(){
     if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }else{
      console.log(this.signupForm.value);
      const formData = {
        fullName : this.signupForm.value.fullName,
        email : this.signupForm.value.email,
        username : this.signupForm.value.username,
        password :this.signupForm.value.password,
        passwordConfirm : this.signupForm.value.confirmPassword,
        phone : this.signupForm.value.mobile
      } 
      console.log(formData);
      this.user.signup(formData).subscribe({
        next:((res)=>{
          console.log('sign up successfull',res);
          this.router.navigate(['login']);
        }),
        error:((error)=>{
          console.log('signup failed',error);
        }),
      })
    }
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

  // Custom validator to ensure password and confirmPassword match
  private passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const pw = group.get(passwordKey)?.value;
      const cpw = group.get(confirmKey)?.value;
      if (pw === cpw) {
        // if confirm control had previous error 'mismatch', remove it
        const confirm = group.get(confirmKey);
        if (confirm?.errors && confirm.errors['mismatch']) {
          const { mismatch, ...rest } = confirm.errors;
          confirm.setErrors(Object.keys(rest).length ? rest : null);
        }
        return null;
      } else {
        group.get(confirmKey)?.setErrors({ ...(group.get(confirmKey)?.errors || {}), mismatch: true });
        return { passwordsMismatch: true };
      }
    };
  }
 
  
  login(){
    this.router.navigate(['login']);
  }
}
