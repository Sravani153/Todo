import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserstorageService } from '../storage/userstorage.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userStorage: UserstorageService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.userStorage.getUserRole();
    const isAuthenticated = this.userStorage.isAuthenticated();

    if (isAuthenticated) {
      if (expectedRoles && !expectedRoles.includes(userRole || '')) {
        // If user role does not match any of the expected roles, return false
        return false;
      }
      // Role matches or no role is required
      return true;
    } else {
      // Not authenticated, redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
  }

}
