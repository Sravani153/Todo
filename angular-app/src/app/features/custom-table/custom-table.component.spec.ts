import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomTableComponent } from './custom-table.component';
import { MatTableDataSource } from '@angular/material/table';
import { ItemService } from 'src/app/services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as XLSX from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { Item } from 'src/app/model/item.model';

interface XLSXUtils {
  json_to_sheet: (data: any) => any;
  book_new: () => any;
  book_append_sheet: (workbook: any, worksheet: any, sheetName: string) => void;
  writeFile: (workbook: any, filename: string) => void;
}

describe('CustomTableComponent', () => {
  let component: CustomTableComponent<any>;
  let fixture: ComponentFixture<CustomTableComponent<any>>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockUserStorage: jasmine.SpyObj<UserstorageService>;

  const mockItems: Item[] = [
    { id: '1', name: 'John Doe', dob: new Date('1990-01-01'), gender: 'Male', email: 'john@example.com', phone: ['12345'], bookmark: false },
    { id: '2', name: 'Jane Smith', dob: new Date('1985-06-15'), gender: 'Female', email: 'jane@example.com', phone: ['67890'], bookmark: true },
    { id: '3', name: 'Sravs', dob: new Date('1985-06-15'), gender: 'Female', email: 'sravs@example.com', phone: ['67890'], bookmark: true }

  ];


  beforeEach(async () => {
    mockItemService = jasmine.createSpyObj('ItemService', ['getAllItems', 'deleteItems']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockUserStorage = jasmine.createSpyObj('UserstorageService', ['isAdminLoggedIn']);

    mockItemService.getAllItems.and.returnValue(of(mockItems));

    await TestBed.configureTestingModule({
      declarations: [CustomTableComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: UserstorageService, useValue: mockUserStorage }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle all selections', () => {
    component.dataSource.data = [{ id: '1' }, { id: '2' }];
    component.toggleAllSelection();
    expect(component.selection.selected.length).toBe(2);

    component.toggleAllSelection();
    expect(component.selection.selected.length).toBe(0);
  });

  it('should load items successfully and display a success message', () => {
    mockItemService.getAllItems.and.returnValue(of(mockItems));
    component.isBookmarkedPage = false;

    component.loadItems();

    expect(component.items).toEqual(mockItems);
    expect(component.dataSource.data).toEqual(mockItems);
    expect(component.isLoading).toBeFalse();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Items loaded successfully.', 'Close',  Object({ duration: 3000 }));
  });

  it('should filter and display only bookmarked items if isBookmarkedPage is true', () => {
    mockItemService.getAllItems.and.returnValue(of(mockItems));
    component.isBookmarkedPage = true;

    component.loadItems();

    const bookmarkedItems = mockItems.filter(item => item.bookmark);
    expect(component.bookmarkedItems).toEqual(bookmarkedItems);
    expect(component.dataSource.data).toEqual(bookmarkedItems);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error and display error message if items fail to load', () => {
    mockItemService.getAllItems.and.returnValue(throwError(() => new Error('Error loading items')));

    component.loadItems();

    expect(component.isLoading).toBeFalse();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Failed to load items.', 'Close', Object({ duration: 3000 }));
  });


  // describe('exportToExcel', () => {
  //   it('should generate an Excel file with item data', () => {
  //     const mockItems = [
  //       {
  //         id: '1',
  //         name: 'John Doe',
  //         dateOfBirth: new Date('1990-05-09'),
  //         gender: 'Male',
  //         email: 'john@example.com',
  //         phoneNumbers: ['12345'],
  //         bookmarked: false,
  //       },
  //       {
  //         id: '2',
  //         name: 'Jane Smith',
  //         dateOfBirth: new Date('1985-06-20'),
  //         gender: 'Female',
  //         email: 'jane@example.com',
  //         phoneNumbers: ['67890'],
  //         bookmarked: true,
  //       },
  //     ];

  //     spyOn(XLSX.utils, 'json_to_sheet').and.callThrough(); // Spy on XLSX methods
  //     spyOn(XLSX.utils, 'book_new').and.callThrough();
  //     spyOn(XLSX.utils, 'book_append_sheet').and.callThrough();
  //     spyOn(XLSX, 'writeFile').and.callFake((workbook, filename) => {}); // Mock writeFile

  //     component.exportToExcel();

  //     expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith([
  //       {
  //         Name: 'John Doe',
  //         'Date of Birth': new Date('1990-05-09'),
  //         Gender: 'Male',
  //         Email: 'john@example.com',
  //         'Phone Numbers': '12345',
  //         Bookmarked: 'No',
  //       },
  //       {
  //         Name: 'Jane Smith',
  //         'Date of Birth': new Date('1985-06-20'),
  //         Gender: 'Female',
  //         Email: 'jane@example.com',
  //         'Phone Numbers': '67890',
  //         Bookmarked: 'Yes',
  //       },
  //     ]);
  //     expect(XLSX.utils.book_new).toHaveBeenCalled();
  //     expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
  //     expect(XLSX.writeFile).toHaveBeenCalledWith(jasmine.any(Object), 'items.xlsx');
  //   });
  // });


  // it('should delete selected items', () => {
  //   const selectedItems = [{ id: '1' }, { id: '2' }];
  //   selectedItems.forEach(item => component.selection.select(item)); // Use select to add items

  //   mockItemService.deleteItems.and.returnValue(of(null));

  //   component.deleteSelected();

  //   expect(mockItemService.deleteItems).toHaveBeenCalledWith(['1', '2']);
  //   expect(mockSnackBar.open).toHaveBeenCalledWith('Selected items deleted successfully!', 'Close', { duration: 3000 });
  // });


  // it('should show message when no items are selected for deletion', () => {
  //   component.deleteSelected();
  //   expect(mockSnackBar.open).toHaveBeenCalledWith('No items selected for deletion.', 'Close', { duration: 3000 });
  // });

  it('should emit toggleBookmark event', () => {
    spyOn(component.toggleBookmark, 'emit');
    const item = { id: '1' };
    component.onToggleBookmark(item);
    expect(component.toggleBookmark.emit).toHaveBeenCalledWith(item);
  });

  it('should emit editItem event', () => {
    spyOn(component.editItem, 'emit');
    const id = '1';
    component.onEdit(id);
    expect(component.editItem.emit).toHaveBeenCalledWith(id);
  });

  it('should emit deleteItem event', () => {
    spyOn(component.deleteItem, 'emit');
    const id = '1';
    component.onDelete(id);
    expect(component.deleteItem.emit).toHaveBeenCalledWith(id);
  });
});
