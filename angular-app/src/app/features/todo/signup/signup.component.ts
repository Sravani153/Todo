import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
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
import { AccountDTO } from 'src/app/model/AccountDTO';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-signup',
  standalone:true,
    imports: [
      CommonModule,
      MatIconModule,
      FormsModule,
      RouterModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatSnackBarModule,
      MatCardModule,
      MatTableModule,
      MatSelectModule,
      MatOptionModule,
      MatTabsModule,
      MatToolbarModule,
      MatInputModule,
      MatButtonToggleModule,
      MatButtonModule
    ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  hidePassword: boolean = true;

  constructor(private fb: FormBuilder,
     private accountService: AccountService,
     public snackBar: MatSnackBar,  // Change snackBar to public
     private router: Router
    )
   {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  // Method to toggle password visibility
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { confirmPassword, ...accountData } = this.signupForm.value;

      accountData.role = 'USER';

      console.log('Submitting account data:', accountData);

      this.accountService.createAccount(accountData as AccountDTO).subscribe(
        response => {
          this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
          this.router.navigateByUrl('/login');
        },
        error => {
          console.log('Error occurred:', error);
          if (error.status === 409) {
            this.snackBar.open('Account with this email already exists.', 'Close', { duration: 3000 });
          } else {
            this.snackBar.open('Error creating account. Please try again.', 'Close', { duration: 3000 });
          }
        }
      );
    }
  }
}
