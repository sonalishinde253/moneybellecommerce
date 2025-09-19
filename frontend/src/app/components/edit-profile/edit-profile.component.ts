import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../services/profile/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SidebarComponent,
    LoadingSpinnerComponent,
  ],
  providers: [ProfileService],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  fileToUpload: File | null = null;
  userInfo: any = {};
  isLoading = true;
  errorMessage = '';
  showErrorBox = false;
  timeoutId: any;
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({});
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        if (
          data.image.includes(
            'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png'
          )
        ) {
          data.image =
            'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png';
        } else data.image = 'data:image/png;base64,' + data.image;

        console.log(data);
        this.userInfo = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      image: [''],
    });

    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.userForm.patchValue(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onSubmit() {
     if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }else{
      
      const updatedUserData = this.userForm.value;
      console.log('Updated user data:', updatedUserData);
      const formData = new FormData();

      // Append the updated user data to the form data
      for (const key in updatedUserData) {
        formData.append(key, updatedUserData[key]);
      }

      // Append the file to the form data if a file was selected
      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload);
      }
      console.log(formData);
      this.profileService.updateProfile(updatedUserData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
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
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.fileToUpload = event.target.files[0];
      this.profileService.updateImage(this.fileToUpload).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error updating image:', error);
        },
      });
    } else {
      this.fileToUpload = null;
    }
  }
}
