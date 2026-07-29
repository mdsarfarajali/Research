import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  roles = [
    { value: UserRole.Student, label: 'Student' },
    { value: UserRole.Faculty, label: 'Faculty' },
    { value: UserRole.Admin, label: 'Admin' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.Student, Validators.required],
      department: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.isLoading = true; this.errorMessage = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.errorMessage = err.message; this.isLoading = false; }
    });
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }
  get f() { return this.registerForm.controls; }
}
