import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { SignupComponent } from './signup.component';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAccountService {
  createAccount(accountData: any) {
    return of({});
  }
}

class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let accountService: AccountService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
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
      providers: [
        { provide: AccountService, useClass: MockAccountService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(AccountService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values and validation', () => {
    const signupForm = component.signupForm;
    const signupFormValues = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    expect(signupForm.value).toEqual(signupFormValues);
    expect(signupForm.valid).toBeFalsy();
  });

  it('should require name, email, password, and confirmPassword fields', () => {
    const name = component.signupForm.get('name');
    const email = component.signupForm.get('email');
    const password = component.signupForm.get('password');
    const confirmPassword = component.signupForm.get('confirmPassword');

    name?.setValue('');
    email?.setValue('');
    password?.setValue('');
    confirmPassword?.setValue('');

    expect(name?.valid).toBeFalsy();
    expect(email?.valid).toBeFalsy();
    expect(password?.valid).toBeFalsy();
    expect(confirmPassword?.valid).toBeFalsy();
  });

  it('should check for email format validation', () => {
    const email = component.signupForm.get('email');
    email?.setValue('invalid-email');

    expect(email?.valid).toBeFalsy();
    expect(email?.hasError('email')).toBeTruthy();
  });

  it('should match password and confirmPassword', () => {
    const password = component.signupForm.get('password');
    const confirmPassword = component.signupForm.get('confirmPassword');

    password?.setValue('1234');
    confirmPassword?.setValue('12345');

    expect(component.signupForm.errors?.['mismatch']).toBeTruthy();

    confirmPassword?.setValue('1234');
    expect(component.signupForm.errors?.['mismatch']).toBeFalsy();
  });

  it('should submit valid form for USER role', () => {
    spyOn(accountService, 'createAccount').and.callThrough();
    spyOn(router, 'navigateByUrl');

    component.signupForm.setValue({
      name: 'Test User',
      email: 'user@gmail.com',
      password: '1234',
      confirmPassword: '1234'
    });

    component.onSubmit();

    expect(accountService.createAccount).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Test User',
      email: 'user@gmail.com',
      password: '1234',
      role: 'USER'
    }));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should submit valid form for ADMIN role', () => {
    spyOn(accountService, 'createAccount').and.callThrough();
    spyOn(router, 'navigateByUrl');

    component.signupForm.setValue({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'adminPass',
      confirmPassword: 'adminPass'
    });

    component.onSubmit();

    expect(accountService.createAccount).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'adminPass',
      role: 'USER'
    }));
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('should handle error if account already exists (409 conflict)', () => {
    spyOn(accountService, 'createAccount').and.returnValue(throwError({ status: 409 }));
    spyOn(component.snackBar, 'open');

    component.signupForm.setValue({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'adminPass',
      confirmPassword: 'adminPass'
    });

    component.onSubmit();

    expect(component.snackBar.open).toHaveBeenCalledWith('Account with this email already exists.', 'Close', { duration: 3000 });
  });

  it('should handle error if another server error occurs', () => {
    spyOn(accountService, 'createAccount').and.returnValue(throwError({ status: 500 }));
    spyOn(component.snackBar, 'open');

    component.signupForm.setValue({
      name: 'Test User',
      email: 'user@gmail.com',
      password: '1234',
      confirmPassword: '1234'
    });

    component.onSubmit();

    expect(component.snackBar.open).toHaveBeenCalledWith('Error creating account. Please try again.', 'Close', { duration: 3000 });
  });
});
