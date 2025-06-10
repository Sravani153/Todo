import { TestBed } from '@angular/core/testing';
import { UserstorageService } from './userstorage.service';

describe('UserstorageService', () => {
  let service: UserstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserstorageService]
    });
    service = TestBed.inject(UserstorageService);
    localStorage.clear();
  });

  // Test Case 1: Ensure the service is created
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test Case 2: Store and retrieve token from localStorage
  it('should store and retrieve a token from localStorage', () => {
    const token = 'sampleToken';
    service.storeToken(token);
    expect(localStorage.getItem('authToken')).toBe(token);
    expect(service.getToken()).toBe(token);
  });

  // Test Case 3: Return null if no token is stored
  it('should return null if no token is stored', () => {
    expect(service.getToken()).toBeNull();
  });

  // Test Case 4: Clear the token from localStorage
  it('should clear the token from localStorage', () => {
    service.storeToken('sampleToken');
    service.clearSession();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  // Test Case 5: Parse the JWT token and retrieve role
  it('should retrieve the user role from the token', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({ role: 'ADMIN' })) + '.signature';
    service.storeToken(mockToken);
    expect(service.getUserRole()).toBe('ADMIN');
  });

  // Test Case 6: Return null if token has no role
  it('should return null if token has no role', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({})) + '.signature';
    service.storeToken(mockToken);
    expect(service.getUserRole()).toBeNull();
  });

  // Test Case 7: Return null if token is not present
  it('should return null if no token is present', () => {
    expect(service.getUserRole()).toBeNull();
  });

  // Test Case 8: Retrieve email from the token
  it('should retrieve the user email from the token', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({ email: 'test@example.com' })) + '.signature';
    service.storeToken(mockToken);
    expect(service.getEmail()).toBe('test@example.com');
  });

  // Test Case 9: Return null if token has no email
  it('should return null if token has no email', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({})) + '.signature';
    service.storeToken(mockToken);
    expect(service.getEmail()).toBeNull();
  });

  // Test Case 10: Return null if no token is present for getEmail
  it('should return null if no token is present for getEmail', () => {
    expect(service.getEmail()).toBeNull();
  });

  // Test Case 11: Check if the user is logged in as admin
  it('should return true if admin is logged in', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({ role: 'ADMIN' })) + '.signature';
    service.storeToken(mockToken);
    expect(service.isAdminLoggedIn()).toBeTrue();
  });

  // Test Case 12: Check if the user is logged in as regular user
  it('should return true if user is logged in', () => {
    const mockToken = 'header.' + btoa(JSON.stringify({ role: 'USER' })) + '.signature';
    service.storeToken(mockToken);
    expect(service.isUserLoggedIn()).toBeTrue();
  });

  // Test Case 13: Check if no user is authenticated when token is not present
  it('should return false if no token is present for authentication', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  // Test Case 14: Check if user is authenticated when token is present
  it('should return true if token is present for authentication', () => {
    service.storeToken('sampleToken');
    expect(service.isAuthenticated()).toBeTrue();
  });
});
