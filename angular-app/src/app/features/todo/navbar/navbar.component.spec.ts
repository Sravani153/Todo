import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from 'src/app/services/auth.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userStorageSpy: jasmine.SpyObj<UserstorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    userStorageSpy = jasmine.createSpyObj('UserstorageService',  ['isAdminLoggedIn', 'clearSession', 'getUserRole']);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSidenavModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserstorageService, useValue: userStorageSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    authServiceSpy.logout.and.returnValue(of(null));

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isSmallScreen to true if window width is less than or equal to 600px', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(500);
    component.checkScreenSize();
    expect(component.isSmallScreen).toBeTrue();
  });

  it('should set isSmallScreen to false if window width is greater than 600px', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(800);
    component.checkScreenSize();
    expect(component.isSmallScreen).toBeFalse();
  });

  it('should toggle showNavbar on calling toggleNavbar', () => {
    component.showNavbar = false;
    component.toggleNavbar();
    expect(component.showNavbar).toBeTrue();

    component.toggleNavbar();
    expect(component.showNavbar).toBeFalse();
  });

  it('should navigate to login and clear session on successful sign-out', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(of(null));
    component.signOut();
    tick();
    expect(userStorageSpy.clearSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should navigate to login and clear session on sign-out failure', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(throwError(() => new Error('Logout failed')));
    component.signOut();
    tick();
    expect(userStorageSpy.clearSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should display "Add" button only for admin users', () => {
    userStorageSpy.isAdminLoggedIn.and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();

    const addButton = fixture.debugElement.query(By.css('.custom-fab'));
    expect(addButton).toBeTruthy();

    userStorageSpy.isAdminLoggedIn.and.returnValue(false);
    component.ngOnInit();
    fixture.detectChanges();

    const hiddenAddButton = fixture.debugElement.query(By.css('.custom-fab'));
    expect(hiddenAddButton).toBeFalsy();
  });

});
