import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserRole } from '../models';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => { localStorage.clear(); });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated initially', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should login with valid credentials', (done) => {
    service.login({ email: 'admin@research.edu', password: 'admin123' }).subscribe({
      next: (res) => {
        expect(res.accessToken).toBeTruthy();
        expect(res.user.email).toBe('admin@research.edu');
        expect(res.user.role).toBe(UserRole.Admin);
        expect(service.isLoggedIn()).toBeTrue();
        expect(service.getCurrentUser()).toBeTruthy();
        done();
      },
      error: () => { fail('Should not error'); done(); }
    });
  });

  it('should fail login with invalid credentials', (done) => {
    service.login({ email: 'wrong@test.com', password: 'wrong' }).subscribe({
      next: () => { fail('Should not succeed'); done(); },
      error: (err) => {
        expect(err.message).toBe('Invalid email or password');
        expect(service.isLoggedIn()).toBeFalse();
        done();
      }
    });
  });

  it('should logout and clear state', (done) => {
    service.login({ email: 'admin@research.edu', password: 'admin123' }).subscribe(() => {
      expect(service.isLoggedIn()).toBeTrue();
      service.logout();
      expect(service.isLoggedIn()).toBeFalse();
      expect(service.getCurrentUser()).toBeNull();
      expect(service.getToken()).toBeNull();
      done();
    });
  });

  it('should check roles correctly', (done) => {
    service.login({ email: 'admin@research.edu', password: 'admin123' }).subscribe(() => {
      expect(service.hasRole(UserRole.Admin)).toBeTrue();
      expect(service.hasRole(UserRole.Student)).toBeFalse();
      expect(service.hasAnyRole([UserRole.Admin, UserRole.Faculty])).toBeTrue();
      expect(service.hasAnyRole([UserRole.Student])).toBeFalse();
      done();
    });
  });

  it('should store token in localStorage', (done) => {
    service.login({ email: 'faculty@research.edu', password: 'faculty123' }).subscribe(() => {
      const token = service.getToken();
      expect(token).toBeTruthy();
      expect(localStorage.getItem('research_portal_token')).toBe(token);
      done();
    });
  });

  it('should emit user through observable', (done) => {
    const users: any[] = [];
    service.currentUser$.subscribe(u => users.push(u));
    service.login({ email: 'student@research.edu', password: 'student123' }).subscribe(() => {
      expect(users.length).toBeGreaterThanOrEqual(2);
      expect(users[users.length - 1]?.role).toBe(UserRole.Student);
      done();
    });
  });
});
