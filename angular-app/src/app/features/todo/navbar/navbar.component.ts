import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProfilephotoService } from 'src/app/services/profilephoto.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private isSmallScreenSubject = new BehaviorSubject<boolean>(window.innerWidth <= 600);
  private showNavbarSubject = new BehaviorSubject<boolean>(false);
  private profilePhotoUrlSubject = new BehaviorSubject<string | null>(null);
  private currentLanguageSubject = new BehaviorSubject<string>('en');
  private subscriptions: Subscription = new Subscription();

  isSmallScreen$ = this.isSmallScreenSubject.asObservable();
  showNavbar$ = this.showNavbarSubject.asObservable();
  profilePhotoUrl$ = this.profilePhotoUrlSubject.asObservable();
  currentLanguage$ = this.currentLanguageSubject.asObservable();

  @Input() isAdmin = false;

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'it', name: 'Italian' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private userStorage: UserstorageService,
    private translate: TranslateService,
    private profilePhotoService: ProfilephotoService
  ) {
    this.translate.addLangs(this.languages.map(lang => lang.code));

    const savedLanguage = localStorage.getItem('selectedLanguage');
    const browserLang = this.translate.getBrowserLang() ?? 'en';
    const defaultLang = savedLanguage ?? (this.translate.getLangs().includes(browserLang) ? browserLang : 'en');

    this.currentLanguageSubject.next(defaultLang);
    this.translate.setDefaultLang(defaultLang);
    this.translate.use(defaultLang);
  }

  ngOnInit(): void {
    this.isAdmin = this.userStorage.isAdminLoggedIn();

    this.subscriptions.add(
      this.profilePhotoService.profilePhotoUrl$.subscribe(url => {
        this.profilePhotoUrlSubject.next(url);
      })
    );

    const storedPhotoUrl = localStorage.getItem('profilePhotoUrl');
    if (storedPhotoUrl) {
      this.profilePhotoUrlSubject.next(storedPhotoUrl);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  switchLanguage(language: string): void {
    this.currentLanguageSubject.next(language);
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language);
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.isSmallScreenSubject.next(window.innerWidth <= 600);
  }

  toggleNavbar(): void {
    this.showNavbarSubject.next(!this.showNavbarSubject.getValue());
  }

 signOut(): void {
   this.authService.logout().subscribe({
     next: () => {
       this.userStorage.clearSession();
       this.router.navigate(['/login']);
     },
     error: (err) => {
      console.error('Logout failed', err);
       this.userStorage.clearSession();
       this.router.navigate(['/login']);
     }
   });
 }
}
