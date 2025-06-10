import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookmarkComponent } from './bookmark.component';
import { ItemService } from 'src/app/services/item.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

describe('BookmarkComponent', () => {
  let component: BookmarkComponent;
  let fixture: ComponentFixture<BookmarkComponent>;
  let itemService: jasmine.SpyObj<ItemService>;
  let userStorage: jasmine.SpyObj<UserstorageService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  const mockItems = [
    {
      id: '1',
      name: 'John Doe',
      dob: new Date('1990-01-01'),
      bookmark:true,
      gender: 'Male',
      email: 'john.doe@example.com',
      phone: ['1234567890', '0987654321']
    }
  ];

  beforeEach(async () => {
    itemService = jasmine.createSpyObj('ItemService', ['getBookmarkedItems', 'deleteItem']);
    userStorage = jasmine.createSpyObj('UserstorageService', ['isAdminLoggedIn', 'isUserLoggedIn']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [BookmarkComponent],
      providers: [
        { provide: ItemService, useValue: itemService },
        { provide: UserstorageService, useValue: userStorage },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unrecognized elements in the template
    }).compileComponents();

    itemService.getBookmarkedItems.and.returnValue(of(mockItems));
    userStorage.isAdminLoggedIn.and.returnValue(true);  // Example: Setting the mock admin login status
    userStorage.isUserLoggedIn.and.returnValue(false);

    fixture = TestBed.createComponent(BookmarkComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly on ngOnInit', () => {
    userStorage.isAdminLoggedIn.and.returnValue(true);
    userStorage.isUserLoggedIn.and.returnValue(false);

    component.ngOnInit();

    expect(component.isAdmin).toBe(true);
    expect(component.displayedColumns).toEqual(['name', 'dob', 'gender', 'email', 'phone', 'actions']);
    expect(itemService.getBookmarkedItems).toHaveBeenCalled();
  });


  it('should load bookmarked items successfully', () => {
    // Arrange: Mock service to return mock items
    itemService.getBookmarkedItems.and.returnValue(of(mockItems));

    // Act: Call the method that loads the bookmarked items
    component.loadBookmarkedItems();

    // Assert: Check if bookmarkedItems is set to MatTableDataSource
    expect(component.bookmarkedItems instanceof MatTableDataSource).toBeTrue();
    expect(component.bookmarkedItems.data).toEqual(mockItems);
    expect(component.isLoading).toBe(false);
    expect(snackBar.open).toHaveBeenCalledWith('Bookmarked items loaded successfully.', 'Close', { duration: 3000 });
  });


  it('should handle error when loading bookmarked items', () => {
    itemService.getBookmarkedItems.and.returnValue(throwError('Error loading items'));

    component.loadBookmarkedItems();

    expect(component.isLoading).toBe(false);
    expect(snackBar.open).toHaveBeenCalledWith('Failed to load bookmarked items.', 'Close', { duration: 3000 });
  });

  it('should navigate to edit page on edit', () => {
    component.onEdit('1');

    expect(router.navigate).toHaveBeenCalledWith(['/add'], { queryParams: { id: '1' } });
  });

  it('should delete an item successfully', () => {
    spyOn(component, 'loadBookmarkedItems');  // Spy on the method
    itemService.deleteItem.and.returnValue(of(undefined));

    component.onDelete('1');

    expect(itemService.deleteItem).toHaveBeenCalledWith('1');
    expect(snackBar.open).toHaveBeenCalledWith('Item deleted successfully!', 'Close', { duration: 3000 });
    expect(component.loadBookmarkedItems).toHaveBeenCalled();
  });


  it('should update displayed columns for admin role', () => {
    // userStorage.isAdminLoggedIn.and.returnValue(true);
    component.isAdmin = true;
    component.updateDisplayedColumns();

    expect(component.displayedColumns).toEqual(['name', 'dob', 'gender', 'email', 'phone', 'actions']);
  });

  it('should update displayed columns for user role', () => {
    component.isAdmin = false;
    component.updateDisplayedColumns();

    expect(component.displayedColumns).toEqual(['name', 'dob', 'gender', 'email', 'phone']);
  });

  it('should show snack bar messages', () => {
    component['showSnackBar']('Test message', 'Close');

    expect(snackBar.open).toHaveBeenCalledWith('Test message', 'Close', { duration: 3000 });
  });
});
