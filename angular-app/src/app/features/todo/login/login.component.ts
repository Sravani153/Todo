import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';

@Component({
  selector: 'app-login',
  standalone:true,
    imports: [
      CommonModule,
      MatIconModule,
      RouterModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatCardModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
      MatInputModule,
      MatSnackBarModule,
      MatButtonToggleModule,
      MatButtonModule,
      MatSelectModule,
      MatOptionModule
    ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signInForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router,
    private userStorageServ: UserstorageService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.signInForm.invalid) {
      this.snackBar.open('Please fill in all required fields correctly.', 'OK', {
        duration: 5000,
        panelClass: 'error-snackbar'
      });
      return;
    }

    const email = this.signInForm.get('email')?.value;
    const password = this.signInForm.get('password')?.value;

    this.authService.login(email, password).subscribe(
      (success: boolean) => {
        if (success) {
          const userRole = this.userStorageServ.getUserRole();
          console.log('Login Success - User Role:', userRole);

          if (userRole === 'ADMIN') {
            this.snackBar.open('Logged In Successfully as Admin.', 'OK', { duration: 5000 });
            this.router.navigateByUrl('/list');
          } else if (userRole === 'USER') {
            this.snackBar.open('Logged In Successfully as User.', 'OK', { duration: 5000 });
            console.log('Navigating to /list...');
           this.router.navigateByUrl('/list');

            // this.router.navigate(['/list']);

          }
        } else {
          this.snackBar.open('Login failed', 'ERROR', { duration: 5000, panelClass: 'error-snackbar' });
        }
      },
      (error) => {
        this.snackBar.open('Bad Credentials', 'ERROR', { duration: 5000, panelClass: 'error-snackbar' });
        console.error('Login failed', error);
      }
    );
  }
  }

