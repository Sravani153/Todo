import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { UserstorageService } from '../storage/userstorage.service';
import { AccountDTO } from '../model/AccountDTO';
import { environment } from '../environments/environment';
import { HttpHeaders } from '@angular/common/http';

describe('AccountService', () => {
  let service: AccountService;
  let httpMock: HttpTestingController;
  let userStorageServ: jasmine.SpyObj<UserstorageService>;
  const apiUrl = `${environment.apiBaseUrl}/accounts`;

  beforeEach(() => {
    const userStorageSpy = jasmine.createSpyObj('UserstorageService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AccountService,
        { provide: UserstorageService, useValue: userStorageSpy },
      ],
    });

    service = TestBed.inject(AccountService);
    httpMock = TestBed.inject(HttpTestingController);
    userStorageServ = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an account', () => {
    const mockAccount: AccountDTO = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };

    service.createAccount(mockAccount).subscribe((account) => {
      expect(account).toEqual(mockAccount);
    });

    const req = httpMock.expectOne(`${apiUrl}/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(mockAccount);
  });

  it('should retrieve all accounts', () => {
    const mockAccounts: AccountDTO[] = [
      { id: '1', email: 'test1@example.com', name: 'Test User 1', password: 'password123' },
      { id: '2', email: 'test2@example.com', name: 'Test User 2', password: 'password123' }
    ];

    service.getAllAccounts().subscribe((accounts) => {
      expect(accounts.length).toBe(2);
      expect(accounts).toEqual(mockAccounts);
    });

    const req = httpMock.expectOne(`${apiUrl}/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAccounts);
  });

  it('should delete an account', () => {
    const email = 'test@example.com';

    service.deleteAccount(email).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/delete/${email}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  // it('should retrieve the user profile', () => {
  //   const mockProfile: AccountDTO = {
  //     id: '1',
  //     email: 'test@example.com',
  //     name: 'Test User',
  //     password: 'password123',
  //   };

  //   // service.getProfile().subscribe((profile) => {
  //   //   expect(profile).toEqual(mockProfile);
  //   // });

  //   const req = httpMock.expectOne(`${apiUrl}/profile`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockProfile);
  // });

  // it('should update the user profile', () => {
  //   const updatedProfile: AccountDTO = {
  //     id: '1',
  //     email: 'test@example.com',
  //     name: 'Updated User',
  //     password: 'password123',
  //   };

  //   service.updateProfile(updatedProfile).subscribe((profile) => {
  //     expect(profile).toEqual(updatedProfile);
  //   });

  //   const req = httpMock.expectOne(`${apiUrl}/profile/update`);
  //   expect(req.request.method).toBe('PUT');
  //   req.flush(updatedProfile);
  // });

  // it('should retrieve an account by email', () => {
  //   const email = 'test@example.com';
  //   const mockAccount: AccountDTO = {
  //     id: '1',
  //     email,
  //     name: 'Test User',
  //     password: 'password123',
  //   };

  //   service.getAccountByEmail(email).subscribe((account) => {
  //     expect(account).toEqual(mockAccount);
  //   });

  //   const req = httpMock.expectOne(`${apiUrl}/${email}`);
  //   expect(req.request.method).toBe('GET');
  //   req.flush(mockAccount);
  // });

  it('should create authorization header with token', () => {
    const mockToken = 'mock-token';
    userStorageServ.getToken.and.returnValue(mockToken);

    const headers = service['createAuthorizationHeader'](); // Accessing the private method
    expect(headers instanceof HttpHeaders).toBe(true);
    expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
  });
});
