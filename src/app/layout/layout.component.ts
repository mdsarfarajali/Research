import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { User } from '../core/models';

@Component({
  standalone: false,
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/papers', label: 'Papers', icon: 'papers' },
    { path: '/faculty', label: 'Faculty', icon: 'faculty' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(u => this.currentUser = u);
  }

  toggleSidebar(): void { this.isSidebarCollapsed = !this.isSidebarCollapsed; }
  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu(): void { this.isMobileMenuOpen = false; }

  logout(): void { this.authService.logout(); this.router.navigate(['/auth/login']); }

  isActive(path: string): boolean { return this.router.url.startsWith(path); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
