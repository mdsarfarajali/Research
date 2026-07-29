import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../../shared/shared.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, SharedModule]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  it('should initialize form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email format', () => {
    component.loginForm.patchValue({ email: 'invalid', password: '123456' });
    expect(component.loginForm.get('email')?.errors?.['email']).toBeTruthy();
  });

  it('should validate password minimum length', () => {
    component.loginForm.patchValue({ email: 'test@test.com', password: '123' });
    expect(component.loginForm.get('password')?.errors?.['minlength']).toBeTruthy();
  });

  it('should be valid with correct data', () => {
    component.loginForm.patchValue({ email: 'admin@research.edu', password: 'admin123' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePassword();
    expect(component.showPassword).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(component.isLoading).toBeFalse();
  });
});
