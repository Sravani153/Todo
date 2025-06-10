import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { UserstorageService } from '../storage/userstorage.service';
import { environment } from '../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let userStorageServ: jasmine.SpyObj<UserstorageService>;
  let router: jasmine.SpyObj<Router>;
  const apiUrl = `${environment.apiBaseUrl}/auth`;

  beforeEach(() => {
    const userStorageSpy = jasmine.createSpyObj('UserstorageService', ['storeToken', 'clearSession', 'getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: UserstorageService, useValue: userStorageSpy },
        { provide: Router, useValue: routerSpy },
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    userStorageServ = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login and store token when credentials are valid', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = { token: 'valid_token' };

    service.login(email, password).subscribe((result) => {
      expect(result).toBeTrue();
      expect(userStorageServ.storeToken).toHaveBeenCalledWith('valid_token');
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return false and handle 401 error when login fails', () => {
    const email = 'test@example.com';
    const password = 'password123';

    service.login(email, password).subscribe((result) => {
      expect(result).toBeFalse();
      expect(userStorageServ.clearSession).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout and clear session when valid token exists', () => {
    userStorageServ.getToken.and.returnValue('valid_token');

    service.logout().subscribe(() => {
      expect(userStorageServ.clearSession).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    const req = httpMock.expectOne(`${apiUrl}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer valid_token');
    req.flush('Logged out');
  });

  it('should handle logout error', () => {
    userStorageServ.getToken.and.returnValue('valid_token');

    service.logout().subscribe((result) => {
      expect(result).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/logout`);
    req.flush('Logout failed', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should return null if no token is available during logout', () => {
    userStorageServ.getToken.and.returnValue(null);

    service.logout().subscribe((result) => {
      expect(result).toBeNull();
    });

    httpMock.expectNone(`${apiUrl}/logout`);
  });
});
