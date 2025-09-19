import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../user/user.service';
@Injectable({
  providedIn: 'root',
})
export class CardIsNotEmptyService implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return this.userService
      .getCart()
      .toPromise()
      .then((products) => {
        if (products.data.length === 0) {
          this.router.navigate(['/catalog']);
          return false;
        }
        return true;
      })
      .catch((error) => {
        console.error(error);
        this.router.navigate(['/catalog']);
        return false;
      });
  }
}
