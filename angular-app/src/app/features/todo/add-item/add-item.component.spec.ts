import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddItemComponent } from './add-item.component';
import { ItemService } from 'src/app/services/item.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { ActivatedRoute, Routes } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AddItemComponent', () => {
  let component: AddItemComponent;
  let fixture: ComponentFixture<AddItemComponent>;
  let itemService: jasmine.SpyObj<ItemService>;
  let userStorage: jasmine.SpyObj<UserstorageService>;
  let routes: Routes = [
    {
      path: 'list',
      component: AddItemComponent,
      data: { roles: ['ADMIN', 'USER'] }
    }
  ];

  beforeEach(async () => {
    const itemServiceSpy = jasmine.createSpyObj('ItemService', ['getItemById', 'createItem', 'updateItem']);
    const userStorageSpy = jasmine.createSpyObj('UserstorageService', ['isAdminLoggedIn']);

    await TestBed.configureTestingModule({
      declarations: [AddItemComponent, NavbarComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatDialogModule,
        MatToolbarModule,
        MatMenuModule,
        MatTooltipModule,
        MatIconTestingModule,
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ItemService, useValue: itemServiceSpy },
        { provide: UserstorageService, useValue: userStorageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddItemComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    userStorage = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {
    spyOn(component, 'loadItem');
    userStorage.isAdminLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdmin).toBe(true);
    expect(component.itemForm).toBeDefined();
    expect(component.isEdit).toBe(false);
    expect(component.loadItem).not.toHaveBeenCalled();
  });

  it('should load item if id is present in query params', () => {
    const route = TestBed.inject(ActivatedRoute);
    spyOn(route.snapshot.queryParamMap, 'get').and.returnValue('1');
    spyOn(component, 'loadItem');
    component.ngOnInit();
    expect(component.isEdit).toBe(true);
    expect(component.loadItem).toHaveBeenCalledWith('1');
  });

  it('should add a phone number field', () => {
    component.addPhoneNumber();
    expect(component.phoneNumbers.length).toBe(1);
  });

  it('should remove a phone number field', () => {
    component.addPhoneNumber();
    component.addPhoneNumber();
    component.removePhoneNumber(0);
    expect(component.phoneNumbers.length).toBe(1);
  });

  it('should show snackbar on form invalid submit', () => {
    spyOn(component, 'showSnackBar');
    component.onSave();
    expect(component.showSnackBar).toHaveBeenCalledWith('Please fill in all required fields with valid data.', 'Close');
  });

  it('should call createItem when form is valid and is not edit mode', () => {
    const mockItem = { id: '', name: 'John', dob: new Date('1990-01-01'), bookmark: false, gender: 'Male', email: 'john@gmail.com', phone: [] };
    spyOn(component, 'showSnackBar');
    component.isEdit = false;
    component.itemForm.setValue(mockItem);
    itemService.createItem.and.returnValue(of(mockItem));

    component.onSave();
    expect(itemService.createItem).toHaveBeenCalledWith(mockItem);
    expect(component.showSnackBar).toHaveBeenCalledWith('Item created successfully!', 'Close');
  });

  it('should call updateItem when form is valid and is edit mode', () => {
    const mockItem = { id: '1', name: 'John', dob: new Date('1990-01-01'), bookmark: false, gender: 'Male', email: 'john@gmail.com', phone: [] };
    spyOn(component, 'showSnackBar');
    component.isEdit = true;
    component.itemForm.setValue(mockItem);
    itemService.updateItem.and.returnValue(of(mockItem));

    component.onSave();
    expect(itemService.updateItem).toHaveBeenCalledWith('1', mockItem);
    expect(component.showSnackBar).toHaveBeenCalledWith('Item updated successfully!', 'Close');
  });

  it('should handle error on item save', () => {
    const mockItem = { id: '', name: 'John', dob: new Date('1990-01-01'), bookmark: false, gender: 'Male', email: 'john@gmail.com', phone: [] };
    component.isEdit = false;
    component.itemForm.setValue(mockItem);
    itemService.createItem.and.returnValue(throwError({ error: { message: 'Email is already in use' } }));

    spyOn(component, 'handleError');
    component.onSave();
    expect(component.handleError).toHaveBeenCalledWith({ error: { message: 'Email is already in use' } });
  });

  it('should display correct error for invalid email', () => {
    const emailControl = component.itemForm.get('email');
    emailControl?.setValue('invalidemail');
    expect(emailControl?.hasError('email')).toBeTrue();
  });

  it('should validate date not to be in future', () => {
    const dateControl = component.itemForm.get('dob');
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    dateControl?.setValue(futureDate);
    expect(dateControl?.hasError('futureDate')).toBeTrue();
  });

  // Testing loadItem method
  it('should load item details correctly', () => {
    const mockItem = { id: '1', name: 'John', dob: new Date('1990-01-01'), bookmark: false, gender: 'Male', email: 'john@gmail.com', phone: ['1234567890'] };
    itemService.getItemById.and.returnValue(of(mockItem));
    component.loadItem('1');
    expect(component.itemForm.value).toEqual(mockItem);
    expect(component.phoneNumbers.length).toBe(1);
    expect(component.phoneNumbers.at(0).value).toBe('1234567890');
  });

  it('should show snackbar messages for errors', () => {
    spyOn(component, 'showSnackBar');

    component.handleError({ error: { message: 'Email is already in use' } });
    expect(component.showSnackBar).toHaveBeenCalledWith('Email already exists.', 'Close');

    component.handleError({ error: { message: 'Invalid phone number' } });
    expect(component.showSnackBar).toHaveBeenCalledWith('Phone number is not valid.', 'Close');

    component.handleError({ error: { message: 'Some other error' } });
    expect(component.showSnackBar).toHaveBeenCalledWith('An error occurred. Please try again.', 'Close');
});


it('should open snackbar with the correct message', () => {
  const snackBar = TestBed.inject(MatSnackBar);
  spyOn(snackBar, 'open').and.callThrough();
  component.showSnackBar('Test Message', 'Close');
  expect(snackBar.open).toHaveBeenCalledWith('Test Message', 'Close', { duration: 3000 });
});

});
