import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { ItemService } from 'src/app/services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as XLSX from 'xlsx';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let itemServiceMock: jasmine.SpyObj<ItemService>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;
  let userStorageMock: jasmine.SpyObj<UserstorageService>;
  let routerMock: jasmine.SpyObj<Router>;
  let mockItems = [{ id: '1', name: 'Item 1', dob: new Date(), gender: 'Male', email: 'test@example.com', phone: [], bookmark: false }];


  beforeEach(() => {
    itemServiceMock = jasmine.createSpyObj('ItemService', ['getAllItems', 'deleteItem', 'deleteItems','toggleBookmark']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
    userStorageMock = jasmine.createSpyObj('UserstorageService', ['isAdminLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ItemListComponent],
      providers: [
        { provide: ItemService, useValue: itemServiceMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: UserstorageService, useValue: userStorageMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    itemServiceMock.getAllItems.and.returnValue(of(mockItems));

    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAdmin based on UserstorageService', () => {
    userStorageMock.isAdminLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdmin).toBeTrue();
  });
  it('should set isAdmin to false when UserstorageService returns false', () => {
    userStorageMock.isAdminLoggedIn.and.returnValue(false);
    component.ngOnInit();
    expect(component.isAdmin).toBeFalse();
  });


  it('should load items on init', () => {
    const mockItems = [{ id: '1', name: 'Item 1', dob: new Date(), gender: 'Male', email: 'test@example.com', phone: [], bookmark: false }];
    itemServiceMock.getAllItems.and.returnValue(of(mockItems));

    component.loadItems();

    expect(itemServiceMock.getAllItems).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
    expect(component.dataSource.data).toEqual(mockItems);
    expect(component.isLoading).toBeFalse();
    expect(snackBarMock.open).toHaveBeenCalledWith('Items loaded successfully.', 'Close', { duration: 3000 });
  });

  it('should handle load items error', () => {
    itemServiceMock.getAllItems.and.returnValue(throwError('Error loading items'));

    component.loadItems();

    expect(component.isLoading).toBeFalse();
    expect(snackBarMock.open).toHaveBeenCalledWith('Failed to load items.', 'Close', { duration: 3000 });
  });

  it('should navigate to edit when onEdit is called', () => {
    component.onEdit('1');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/add'], { queryParams: { id: '1' } });
  });

  it('should delete an item', () => {
    itemServiceMock.deleteItem.and.returnValue(of(undefined)); // Mock successful deletion

    component.onDelete('1');

    // Confirm deletion prompt
    spyOn(window, 'confirm').and.returnValue(true); // Simulate user confirming deletion
    expect(itemServiceMock.deleteItem).toHaveBeenCalledWith('1');
    expect(snackBarMock.open).toHaveBeenCalledWith('Item deleted successfully!', 'Close', { duration: 3000 });
  });

  it('should not delete an item if canceled', () => {
    spyOn(window, 'confirm').and.returnValue(false); // Simulate user canceling deletion
    component.onDelete('1');
    expect(itemServiceMock.deleteItem).not.toHaveBeenCalled();
    expect(snackBarMock.open).toHaveBeenCalledWith('Delete operation canceled', 'Close', { duration: 3000 });
  });

  it('should toggle bookmark status', () => {
    const mockItem = { id: '1', name: 'John Doe', dob: new Date('1990-01-01'), gender: 'Male', email: 'john@example.com', phone: ['123456789'], bookmark: false };
    itemServiceMock.toggleBookmark.and.returnValue(of(mockItem));

    component.toggleBookmarked(mockItem);

    expect(itemServiceMock.toggleBookmark).toHaveBeenCalledWith(mockItem.id, true);
    expect(mockItem.bookmark).toBeTrue();
    expect(snackBarMock.open).toHaveBeenCalledWith('Bookmark status updated to bookmark.', 'Close', { duration: 3000 });
  });

  it('should handle toggle bookmark error', () => {
    const mockItem = { id: '1', name: 'John Doe', dob: new Date('1990-01-01'), gender: 'Male', email: 'john@example.com', phone: ['123456789'], bookmark: false };
    itemServiceMock.toggleBookmark.and.returnValue(throwError('Error toggling bookmark'));

    component.toggleBookmarked(mockItem);

    expect(snackBarMock.open).toHaveBeenCalledWith('Failed to update bookmark status.', 'Close', { duration: 3000 });
  });
  // it('should export items to Excel', () => {
  //   // Arrange: Create mock items for testing
  //   const mockItems = [
  //     { id: '1', name: 'Item 1', dateOfBirth: new Date(), gender: 'Male', email: 'test@example.com', phoneNumbers: ['1234567890'], bookmarked: false },
  //     { id: '2', name: 'Item 2', dateOfBirth: new Date(), gender: 'Female', email: 'test2@example.com', phoneNumbers: ['0987654321'], bookmarked: true }
  //   ];

  //   component.items = mockItems;  // Assign the mock items to the component
  //   component.dataSource.data = mockItems;  // Ensure dataSource is populated

  //   // Mock the XLSX.writeFile method to avoid actual file writing
  //   const writeFileSpy = spyOn(XLSX, 'writeFile').and.stub(); // or use .and.callFake() if you want custom behavior

  //   // Act: Call the exportToExcel method
  //   component.exportToExcel();

  //   // Assert: Verify that the writeFile method was called
  //   expect(writeFileSpy).toHaveBeenCalled();
  //   expect(writeFileSpy).toHaveBeenCalledWith(jasmine.any(Object), 'items.xlsx'); // Check if it was called with correct parameters
  // });



  it('should show message when no items are selected for deletion', () => {
    component.selection.clear(); // Ensure no items are selected

    const snackBarSpy = snackBarMock.open as jasmine.Spy;
    component.deleteSelected();

    expect(snackBarSpy).toHaveBeenCalledWith('No items selected for deletion.', 'Close', { duration: 3000 });
  });

  it('should delete selected items', () => {
    const selectedItems = [
      { id: '1', name: 'Item 1', dob: new Date(), gender: 'Male', email: 'test@example.com', phone: [], bookmark: false },
      { id: '2', name: 'Item 2', dob: new Date(), gender: 'Female', email: 'test2@example.com', phone: [], bookmark: true }
    ];
    component.selection.select(...selectedItems); // Select items to delete
    itemServiceMock.deleteItems.and.returnValue(of(undefined)); // Mock deletion success

    const snackBarSpy = snackBarMock.open as jasmine.Spy;
    spyOn(window, 'confirm').and.returnValue(true); // Simulate user confirming deletion

    component.deleteSelected();

    expect(itemServiceMock.deleteItems).toHaveBeenCalledWith(['1', '2']);
    expect(snackBarSpy).toHaveBeenCalledWith('Selected items deleted successfully!', 'Close', { duration: 3000 });
  });

  it('should clear search', () => {
    component.clearSearch();
    expect(component.searchValue).toBe('');
    expect(component.dataSource.filter).toBe('');
  });
});
