import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userStorageSpy: jasmine.SpyObj<UserstorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authService = jasmine.createSpyObj('AuthService', ['login']);
    const userStorage = jasmine.createSpyObj('UserstorageService', ['getUserRole']);
    const router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UserstorageService, useValue: userStorage },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userStorageSpy = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.signInForm).toBeDefined();
    expect(component.signInForm.controls['email']).toBeDefined();
    expect(component.signInForm.controls['password']).toBeDefined();
  });

  it('should toggle password visibility', () => {
    const initialVisibility = component.hidePassword;
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBe(!initialVisibility);
  });

  it('should show an error if form is invalid on submit', () => {
    component.signInForm.controls['email'].setValue('');
    component.signInForm.controls['password'].setValue('');

    component.onSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Please fill in all required fields correctly.', 'OK', {
      duration: 5000,
      panelClass: 'error-snackbar'
    });
  });

  it('should submit the form and login as Admin', () => {
    component.signInForm.controls['email'].setValue('admin@example.com');
    component.signInForm.controls['password'].setValue('password123');

    authServiceSpy.login.and.returnValue(of(true));
    userStorageSpy.getUserRole.and.returnValue('ADMIN');

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('admin@example.com', 'password123');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Logged In Successfully as Admin.', 'OK', { duration: 5000 });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/list');
  });

  it('should submit the form and login as User', () => {
    component.signInForm.controls['email'].setValue('user@example.com');
    component.signInForm.controls['password'].setValue('password123');

    authServiceSpy.login.and.returnValue(of(true));
    userStorageSpy.getUserRole.and.returnValue('USER');

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Logged In Successfully as User.', 'OK', { duration: 5000 });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/list');
  });

  it('should display error on login failure', () => {
    component.signInForm.controls['email'].setValue('fail@example.com');
    component.signInForm.controls['password'].setValue('wrongpassword');

    authServiceSpy.login.and.returnValue(of(false));

    component.onSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Login failed', 'ERROR', { duration: 5000, panelClass: 'error-snackbar' });
  });

  it('should handle login service error', () => {
    component.signInForm.controls['email'].setValue('error@example.com');
    component.signInForm.controls['password'].setValue('wrongpassword');

    authServiceSpy.login.and.returnValue(throwError('Error during login'));

    component.onSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Bad Credentials', 'ERROR', { duration: 5000, panelClass: 'error-snackbar' });
  });
});
