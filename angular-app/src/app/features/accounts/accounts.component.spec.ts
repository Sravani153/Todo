import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountsComponent } from './accounts.component';
import { AccountService } from 'src/app/services/account.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NavbarComponent } from '../todo/navbar/navbar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AccountsComponent', () => {
  let component: AccountsComponent;
  let fixture: ComponentFixture<AccountsComponent>;
  let accountServiceSpy: jasmine.SpyObj<AccountService>;
  let userStorageSpy: jasmine.SpyObj<UserstorageService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  const mockAccounts = [
    {id:'1', name: 'John Doe', email: 'john@example.com', password:'john',role: 'admin' },
    { id:'2',name: 'Jane Smith', email: 'jane@example.com',password:'jane', role: 'user' }
  ];

  beforeEach(async () => {
     accountServiceSpy = jasmine.createSpyObj('AccountService', ['getAllAccounts']);
     userStorageSpy = jasmine.createSpyObj('UserstorageService', ['isAdminLoggedIn']);
     snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ AccountsComponent, NavbarComponent],
      imports:[HttpClientTestingModule,    MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSidenavModule,
      MatPaginatorModule,
      BrowserAnimationsModule,
      MatProgressSpinnerModule,],
      schemas:[NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccountService, useValue: accountServiceSpy },
        { provide: UserstorageService, useValue: userStorageSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsComponent);

    accountServiceSpy.getAllAccounts.and.returnValue(of(mockAccounts));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isAdmin from userStorage service', () => {
    userStorageSpy.isAdminLoggedIn.and.returnValue(true);
    component.ngOnInit();
    expect(component.isAdmin).toBeTrue();
  });

  it('should load accounts successfully and update dataSource', () => {
    const mockAccounts = [
      {id:'1', name: 'John Doe', email: 'john@example.com', password:'john',role: 'admin' },
      { id:'2',name: 'Jane Smith', email: 'jane@example.com',password:'jane', role: 'user' }
    ];
    accountServiceSpy.getAllAccounts.and.returnValue(of(mockAccounts));

    component.loadAccounts();

    expect(accountServiceSpy.getAllAccounts).toHaveBeenCalled();
    expect(component.dataSource.data.length).toBe(2);
    expect(component.isLoading).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith('All Accounts loaded successfully.', 'Close', { duration: 3000 });
  });

  it('should handle error when loading accounts', () => {
    const errorResponse = new Error('Failed to load accounts');
    accountServiceSpy.getAllAccounts.and.returnValue(throwError(errorResponse));

    component.loadAccounts();

    expect(accountServiceSpy.getAllAccounts).toHaveBeenCalled();
    expect(component.isLoading).toBeFalse();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to load all accounts.', 'Close', { duration: 3000 });
  });

  it('should hide loading spinner after loading completes', () => {
    accountServiceSpy.getAllAccounts.and.returnValue(of([]));
    component.loadAccounts();
    fixture.detectChanges();
    const loadingSpinner = fixture.nativeElement.querySelector('mat-spinner');
    expect(loadingSpinner).toBeFalsy();
    expect(component.isLoading).toBeFalse();
  });

  it('should pass isAdmin to app-navbar component', () => {
    userStorageSpy.isAdminLoggedIn.and.returnValue(true);
    component.ngOnInit();
    fixture.detectChanges();
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbar.componentInstance.isAdmin).toBeTrue();
  });

  it('should display correct snackBar message on successful load', () => {
    accountServiceSpy.getAllAccounts.and.returnValue(of([]));
    component.loadAccounts();
    expect(snackBarSpy.open).toHaveBeenCalledWith('All Accounts loaded successfully.', 'Close', { duration: 3000 });
  });

  it('should display correct snackBar message on failed load', () => {
    const errorResponse = new Error('Failed to load accounts');
    accountServiceSpy.getAllAccounts.and.returnValue(throwError(errorResponse));
    component.loadAccounts();
    expect(snackBarSpy.open).toHaveBeenCalledWith('Failed to load all accounts.', 'Close', { duration: 3000 });
  });

});
