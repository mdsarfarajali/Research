import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as UserRole[];
    if (!expectedRoles || expectedRoles.length === 0) return true;
    if (this.authService.hasAnyRole(expectedRoles)) return true;
    this.router.navigate(['/dashboard']);
    return false;
  }
}
