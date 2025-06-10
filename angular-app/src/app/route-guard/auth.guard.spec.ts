import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserstorageService } from '../storage/userstorage.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userStorageService: jasmine.SpyObj<UserstorageService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userStorageSpy = jasmine.createSpyObj('UserstorageService', ['getUserRole', 'isAuthenticated']);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: UserstorageService, useValue: userStorageSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    userStorageService = TestBed.inject(UserstorageService) as jasmine.SpyObj<UserstorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow activation if authenticated and role matches', () => {
    userStorageService.isAuthenticated.and.returnValue(true);
    userStorageService.getUserRole.and.returnValue('admin');

    const route = { data: { roles: ['admin'] } } as any; // Mock route
    const state = {} as any; // Mock state

    expect(authGuard.canActivate(route, state)).toBe(true);
  });

  it('should not allow activation if not authenticated', () => {
    userStorageService.isAuthenticated.and.returnValue(false);

    const route = { data: { roles: ['admin'] } } as any; // Mock route
    const state = {} as any; // Mock state

    expect(authGuard.canActivate(route, state)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not allow activation if authenticated but role does not match', () => {
    userStorageService.isAuthenticated.and.returnValue(true);
    userStorageService.getUserRole.and.returnValue('user');

    const route = { data: { roles: ['admin'] } } as any; // Mock route
    const state = {} as any; // Mock state

    expect(authGuard.canActivate(route, state)).toBe(false);
  });
});
