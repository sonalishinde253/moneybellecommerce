import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IsUserService {

    constructor(
    private userService: UserService,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.userService.isAdmin()) {
      return true;
    }
    this.router.navigate(['/admin-dashboard']);
    return false;
  }
}
