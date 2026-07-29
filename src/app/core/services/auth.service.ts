import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, LoginRequest, RegisterRequest, AuthResponse, TokenPayload } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private readonly mockUsers: (User & { password: string })[] = [
    { id: '1', email: 'admin@research.edu', password: 'admin123', firstName: 'Dr. Sarah', lastName: 'Mitchell', role: UserRole.Admin, department: 'Computer Science', createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: '2', email: 'faculty@research.edu', password: 'faculty123', firstName: 'Prof. James', lastName: 'Anderson', role: UserRole.Faculty, department: 'Mathematics', createdAt: '2024-02-10T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' },
    { id: '3', email: 'student@research.edu', password: 'student123', firstName: 'Alex', lastName: 'Chen', role: UserRole.Student, department: 'Physics', createdAt: '2024-03-05T00:00:00Z', updatedAt: '2024-06-01T00:00:00Z' }
  ];

  constructor() { this.loadStoredAuth(); }

  private loadStoredAuth(): void {
    const token = localStorage.getItem(environment.jwtTokenKey);
    if (token && !this.isTokenExpired(token)) {
      const payload = this.decodeToken(token);
      if (payload) {
        const user = this.mockUsers.find(u => u.id === payload.sub);
        if (user) { const { password, ...safe } = user; this.currentUserSubject.next(safe); this.isAuthenticatedSubject.next(true); }
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => u.email === credentials.email && u.password === credentials.password);
    if (!user) return throwError(() => new Error('Invalid email or password')).pipe(delay(500));
    const { password, ...safeUser } = user;
    const tp: TokenPayload = { sub: user.id, email: user.email, role: user.role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 };
    const accessToken = btoa(JSON.stringify(tp));
    const refreshToken = btoa(JSON.stringify({ ...tp, exp: tp.exp + 86400 }));
    return of({ accessToken, refreshToken, user: safeUser, expiresIn: 3600 } as AuthResponse).pipe(
      delay(400),
      tap(res => { localStorage.setItem(environment.jwtTokenKey, res.accessToken); localStorage.setItem(environment.refreshTokenKey, res.refreshToken); this.currentUserSubject.next(res.user); this.isAuthenticatedSubject.next(true); })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    if (this.mockUsers.find(u => u.email === data.email)) return throwError(() => new Error('Email already registered'));
    const newUser: User = { id: String(this.mockUsers.length + 1), email: data.email, firstName: data.firstName, lastName: data.lastName, role: data.role, department: data.department, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    const tp: TokenPayload = { sub: newUser.id, email: newUser.email, role: newUser.role, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 };
    return of({ accessToken: btoa(JSON.stringify(tp)), refreshToken: btoa(JSON.stringify({ ...tp, exp: tp.exp + 86400 })), user: newUser, expiresIn: 3600 } as AuthResponse).pipe(
      delay(800), tap(res => { localStorage.setItem(environment.jwtTokenKey, res.accessToken); localStorage.setItem(environment.refreshTokenKey, res.refreshToken); this.currentUserSubject.next(res.user); this.isAuthenticatedSubject.next(true); })
    );
  }

  logout(): void { localStorage.removeItem(environment.jwtTokenKey); localStorage.removeItem(environment.refreshTokenKey); this.currentUserSubject.next(null); this.isAuthenticatedSubject.next(false); }
  getToken(): string | null { return localStorage.getItem(environment.jwtTokenKey); }
  getCurrentUser(): User | null { return this.currentUserSubject.value; }
  isLoggedIn(): boolean { return this.isAuthenticatedSubject.value; }
  hasRole(role: UserRole): boolean { const u = this.currentUserSubject.value; return u ? u.role === role : false; }
  hasAnyRole(roles: UserRole[]): boolean { const u = this.currentUserSubject.value; return u ? roles.includes(u.role) : false; }
  private decodeToken(token: string): TokenPayload | null { try { return JSON.parse(atob(token)); } catch { return null; } }
  private isTokenExpired(token: string): boolean { const p = this.decodeToken(token); if (!p) return true; return p.exp * 1000 < Date.now(); }
}
