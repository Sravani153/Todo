import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { UserstorageService } from '../storage/userstorage.service';
import { Item } from '../model/item.model';
import { HttpHeaders } from '@angular/common/http';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  let userStorageServ: jasmine.SpyObj<UserstorageService>;
  const mockToken = 'mocked-token';
  const mockHeaders = new HttpHeaders().set('Authorization', `Bearer ${mockToken}`);
  const apiUrl = 'http://localhost:8080/todo/v1/api/users';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserstorageService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemService,
        { provide: UserstorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
    userStorageServ = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
    userStorageServ.getToken.and.returnValue(mockToken);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an item', () => {
    const newItem: Item = {
      id: '1',
      name: 'Test Item',
      bookmark: false,
      dob: new Date('1990-01-01'),
      gender: 'Male',
      email: 'test@example.com',
      phone: ['1234567890', '0987654321']
    };

    service.createItem(newItem).subscribe((res) => {
      expect(res).toEqual(newItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(newItem);
  });

  it('should update an item', () => {
    const updatedItem: Item = {
      id: '1',
      name: 'Updated Item',
      bookmark: true,
      dob: new Date('1990-01-01'),
      gender: 'Male',
      email: 'updated@example.com',
      phone: ['1234567890', '0987654321']
    };

    service.updateItem('1', updatedItem).subscribe((res) => {
      expect(res).toEqual(updatedItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(updatedItem);
  });

  it('should get an item by ID', () => {
    const mockItem: Item = {
      id: '1',
      name: 'Test Item',
      bookmark: false,
      dob: new Date('1990-01-01'),
      gender: 'Male',
      email: 'test@example.com',
      phone: ['1234567890']
    };

    service.getItemById('1').subscribe((res) => {
      expect(res).toEqual(mockItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(mockItem);
  });

  it('should get all items', () => {
    const mockItems: Item[] = [
      {
        id: '1',
        name: 'Test Item 1',
        bookmark: false,
        dob: new Date('1990-01-01'),
        gender: 'Male',
        email: 'test1@example.com',
        phone: ['1234567890']
      },
      {
        id: '2',
        name: 'Test Item 2',
        bookmark: true,
        dob: new Date('1992-05-01'),
        gender: 'Female',
        email: 'test2@example.com',
        phone: ['0987654321']
      }
    ];

    service.getAllItems().subscribe((res) => {
      expect(res).toEqual(mockItems);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(mockItems);
  });

  it('should delete an item', () => {
    service.deleteItem('1').subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(null);
  });


  it('should delete multiple items', () => {
    const itemIds = ['1', '2'];

    service.deleteItems(itemIds).subscribe((res) => {
      expect(res).toEqual(itemIds);
    });

    const req = httpMock.expectOne(`${apiUrl}/delete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers).toEqual(mockHeaders);
    expect(req.request.body).toEqual(itemIds);
    req.flush(itemIds);
  });

  it('should get bookmarked items', () => {
    const bookmarkedItems: Item[] = [
      {
        id: '1',
        name: 'Bookmarked Item 1',
        bookmark: true,
        dob: new Date('1990-01-01'),
        gender: 'Male',
        email: 'bookmarked1@example.com',
        phone: ['1234567890']
      }
    ];

    service.getBookmarkedItems().subscribe((res) => {
      expect(res).toEqual(bookmarkedItems);
    });

    const req = httpMock.expectOne(`${apiUrl}/bookmark`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(bookmarkedItems);
  });

  it('should toggle bookmark on an item', () => {
    const updatedItem: Item = {
      id: '1',
      name: 'Test Item',
      bookmark: true,
      dob: new Date('1990-01-01'),
      gender: 'Male',
      email: 'test@example.com',
      phone: ['1234567890']
    };

    service.toggleBookmark('1', true).subscribe((res) => {
      expect(res).toEqual(updatedItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/toggleBookmark`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers).toEqual(mockHeaders);
    expect(req.request.body).toEqual({ bookmark: true });
    req.flush(updatedItem);
  });

  it('should search items', () => {
    const searchTerm = 'Test';
    const mockItems: Item[] = [
      {
        id: '1',
        name: 'Test Item 1',
        bookmark: false,
        dob: new Date('1990-01-01'),
        gender: 'Male',
        email: 'test1@example.com',
        phone: ['1234567890']
      }
    ];

    service.searchItems(searchTerm).subscribe((res) => {
      expect(res).toEqual(mockItems);
    });

    const req = httpMock.expectOne(`${apiUrl}/search?searchTerm=${searchTerm}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers).toEqual(mockHeaders);
    req.flush(mockItems);
  });
});
