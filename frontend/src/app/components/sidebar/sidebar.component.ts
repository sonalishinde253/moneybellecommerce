import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class SidebarComponent {
  @Input() userInfo: any;
  constructor(){}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  }
}
