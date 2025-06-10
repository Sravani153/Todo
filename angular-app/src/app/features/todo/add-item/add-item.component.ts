import { Component, OnInit, Signal, signal, OnDestroy } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap, catchError, retry, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItemService } from 'src/app/services/item.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-add-item',
  standalone:true,
  imports:[  CommonModule,
      MatButtonModule,
      RouterModule,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatIconModule,
      MatTableModule,
      MatSelectModule,
      MatRadioModule,
      MatToolbarModule,
      MatTabsModule,
      MatSnackBarModule,
      MatProgressSpinnerModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      NavbarComponent,
      TranslateModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit{
    itemForm: FormGroup;
    isEdit = false;
    isAdmin = false;
    isLoading = false;

    constructor(
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      private itemService: ItemService,
      public snackBar: MatSnackBar,
      private userStorage: UserstorageService
    ) {
      this.itemForm = this.fb.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
        dob: ['', [Validators.required, this.futureDateValidator]],
        gender: ['', Validators.required],
        email: ['', [Validators.required, Validators.email, this.customEmailValidator]],
        phone: this.fb.array([]),
        bookmark: [false]
      });
    }

    ngOnInit(): void {
      this.isAdmin = this.userStorage.isAdminLoggedIn();
      const id = this.route.snapshot.queryParamMap.get('id');
      if (id) {
        this.isEdit = true;
        this.loadItem(id);
      }
    }

    public loadItem(id: string): void {
      this.isLoading = true;
      this.itemService.getItemById(id).subscribe({
        next: (response) => {
          const item = response.data;

          this.itemForm.patchValue({
            id: item.id,
            name: item.name,
            dob: item.dob,
            gender: item.gender,
            email: item.email,
            bookmark: item.bookmark, // map backend `bookmark` to form's `bookmarked`
          });

          this.phoneNumbers.clear();
          if (Array.isArray(item.phone)) {
            item.phone.forEach((phoneNumber: string) => {
              this.phoneNumbers.push(this.fb.control(phoneNumber, [
                Validators.required,
                Validators.pattern(/^[0-9]{10}$/)
              ]));
            });
          }

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading item:', error);
          this.isLoading = false;
          this.showSnackBar('GENERAL_ERROR', 'CLOSE');
        }
      });
    }

    get phoneNumbers(): FormArray {
      return this.itemForm.get('phone') as FormArray;
    }

    addPhoneNumber(): void {
      this.phoneNumbers.push(this.fb.control('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]));
    }

    removePhoneNumber(index: number): void {
      this.phoneNumbers.removeAt(index);
    }

    onSave(): void {
      if (this.itemForm.invalid) {
        this.showSnackBar('Please fill in all required fields with valid data.', 'Close');
        return;
      }

      const formValue = this.itemForm.value;

      // Prepare payload with mapped fields
      const payload = {
        ...formValue,
        phone: formValue.phoneNumbers,
        bookmark: formValue.bookmark
      };

      this.isLoading = true;

      const saveOperation = this.isEdit
        ? this.itemService.updateItem(payload.id, payload)
        : this.itemService.createItem(payload);

      saveOperation.subscribe({
        next: () => {
          this.showSnackBar(`Item ${this.isEdit ? 'updated' : 'created'} successfully!`, 'Close');
          this.router.navigateByUrl('/list');
        },
        error: (error) => this.handleError(error),
        complete: () => this.isLoading = false
      });
    }

    onCancel(): void {
      this.router.navigate(['/list']);
    }

    public handleError(error: any): void {
      if (error.error?.message) {
        if (error.error.message.includes('Email is already in use')) {
          this.showSnackBar('Email already exists.', 'Close');
        } else if (error.error.message.includes('Invalid phone number')) {
          this.showSnackBar('Phone number is not valid.', 'Close');
        } else {
          this.showSnackBar('An error occurred. Please try again.', 'Close');
        }
      } else {
        this.showSnackBar('Unexpected error occurred.', 'Close');
      }
      this.isLoading = false;
    }

    public showSnackBar(message: string, action: string): void {
      this.snackBar.open(message, action, { duration: 3000 });
    }

    private customEmailValidator(control: AbstractControl): { [key: string]: any } | null {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return emailRegex.test(control.value) ? null : { invalidEmail: true };
    }

    private futureDateValidator(control: AbstractControl): { [key: string]: any } | null {
      const selectedDate = new Date(control.value);
      const today = new Date();
      return selectedDate > today ? { futureDate: true } : null;
    }
  }
