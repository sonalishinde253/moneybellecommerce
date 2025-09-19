import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { LoadingSpinnerComponent } from 'src/app/components/loading-spinner/loading-spinner.component';
import { SidebarComponent } from 'src/app/components/sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,LoadingSpinnerComponent,SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrls: []
})
export class ProfileComponent {
 userInfo: any = {};
  showAccount: boolean = true;
  isLoading = true;
  address: string[] = [];
  constructor(public profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        if (
          !data.image.includes(
            'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png'
          )
        )
          data.image = 'data:image/png;base64,' + data.image;
        this.userInfo = data;
        this.address = this.userInfo.address;
        console.log(this.userInfo);
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (val.url === '/profile') {
          this.showAccount = true;
        } else {
          this.showAccount = false;
        }
      }
    });
  }
manageAddress(){
  this.router.navigate(['/manage-address']);
}
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
  isAddressEmpty(): boolean {
    return this.address.length === 0;
  }
}
