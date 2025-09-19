import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmationDialogComponent } from '../user-deletion-confirmation/user-deletion-confirmation.component';
import { UserFormComponent } from '../user-form/user-form.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-accounts-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accounts-overview.component.html',
  styleUrls: []
})
export class AccountsOverviewComponent {
 allUsers: any[] = [];
  displayedUsers: any[] = [];
  currentPage = 0;
  pageSize = 5;
  selectedUser: any = null;
  constructor(
    private accountService: UserService,
    private profileService: ProfileService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  openDialog(user: any) {
    this.selectedUser = user; // Store selected user
    
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '100%',      // Full width on mobile
      maxWidth: '48rem',  // 448px max width
      panelClass: 'tailwind-dialog-panel', // optional for custom styling
      disableClose: false,
      data: { user: this.selectedUser }, // Pass user data to dialog
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User Profile Updated Successfully',
        });
        this.loadUsers(); // Reload users to reflect changes
      } else {
        this.loadUsers(); // Reload users to reflect changes
      }
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
       width: '100%',      // Full width on mobile
      maxWidth: '28rem',  // 448px max width
      panelClass: 'tailwind-dialog-panel', // optional for custom styling
      disableClose: false,
      data: { name: user.username,type:'User' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.profileService.adminDeleteUser(user.username).subscribe({
          next: (response) => {
            this.loadUsers();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'User Profile Deleted Successfully',
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          },
        });
      }
    });
  }

  loadUsers(): void {
    this.accountService.getAllUsers().subscribe({
      next: (response: any) => {
        this.allUsers = response.data;
        // console.log('Total Users:', this.allUsers.length); // Check total users
        this.updateDisplayedProducts();
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  updateDisplayedProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.allUsers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.allUsers.length) {
      this.currentPage++;
      console.log('Next Page:', this.currentPage);
      this.updateDisplayedProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      console.log('Previous Page:', this.currentPage);
      this.updateDisplayedProducts();
    }
  }

  // totalPages(): number {
  //   return Math.ceil(this.allUsers.length / this.pageSize);
  // }
}
