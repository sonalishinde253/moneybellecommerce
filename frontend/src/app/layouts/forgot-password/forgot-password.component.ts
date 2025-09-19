import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: []
})
export class ForgotPasswordComponent {
  forgetpasswordForm:FormGroup;
 constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.forgetpasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    console.log('Form submitted'); // Check if this log appears in the console
    if (this.forgetpasswordForm.valid) {
      const email = this.forgetpasswordForm.value;
      console.log('Email:', email); // Check if email value is correctly retrieved
      this.userService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log('Password reset email sent:', response);
          localStorage.setItem('resetToken', response.resetToken);
          this.router.navigate(['/reset-password']);
        },
        error: (error) => {
          console.log('Password reset failed:', error);
        },
      });
    }
  }
  redirectToLogin(){
    this.router.navigate(['login']);
  }
}
