import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: []
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8),this.passwordStrengthValidator()]],
      confirmPassword: ['',Validators.required]},
      { validators: this.passwordsMatchValidator('password', 'confirmPassword'),    
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;
      const passwordConfirm = this.resetPasswordForm.value.confirmPassword;

      if (newPassword !== passwordConfirm) {
        console.log('Passwords do not match');
        return;
      }

      const resetToken = localStorage.getItem('resetToken');
      if (!resetToken) {
        console.log('Reset token not found');
        return;
      }

      this.userService.resetPassword(newPassword, resetToken).subscribe({
        next: (response) => {
          console.log('Password reset successful:', response);
          localStorage.removeItem('resetToken');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('Password reset failed:', error);
          // Handle error (e.g., display error message)
        },
      });
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
 
}

