import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  private returnUrl: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => { this.router.navigate([this.returnUrl]); },
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  get f() { return this.loginForm.controls; }
}
