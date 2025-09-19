import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,SidebarComponent,ReactiveFormsModule,LoadingSpinnerComponent],
  templateUrl: './change-password.component.html',
  styleUrls: []
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;  
  errorMessage = '';
  showErrorBox = false;
  timeoutId: any;
  userInfo: any = {};
  isLoading = true;

  constructor(
    public profileService: ProfileService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.passwordForm = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmNewPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        if (
          !data.image.includes(
            'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png'
          )
        )
          data.image = 'data:image/png;base64,' + data.image;

        console.log(data);
        this.userInfo = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmNewPassword = form.get('confirmNewPassword')?.value;

    if (newPassword !== confirmNewPassword) {
      form.get('confirmNewPassword')?.setErrors({ mismatch: true });
    } else {
      form.get('confirmNewPassword')?.setErrors(null);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }else{
      const formData = this.passwordForm.value;
      this.profileService.updatePassword(formData).subscribe({
        next: (response) => {
          console.log('Password updated successfully:', response);
          this.showError( 'Password Updated Successfully');
          this.router.navigate(['/profile']);
          // Optionally, you can reset the form or show a success message
        },
        error: (error) => {
          // console.error('Error updating password:', error);
          if (error.error.error === 'Incorrect current password') {
            this.showError( 'Incorrect current password');
          } else {
            this.showError( 'Error updating password');
          }
        },
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
}