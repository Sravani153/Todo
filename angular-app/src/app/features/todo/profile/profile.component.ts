import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { AccountDTO } from 'src/app/model/AccountDTO';
import { ProfilePhoto } from 'src/app/model/ProfilePhoto';
import { AccountService } from 'src/app/services/account.service';
import { ProfilephotoService } from 'src/app/services/profilephoto.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, switchMap, catchError, of } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule, MatCardModule, MatIconModule, TranslateModule, RouterModule]
})
export class ProfileComponent {
  private accountSubject = new BehaviorSubject<AccountDTO | null>(null); // ✅ Reactive state

  profile: ProfilePhoto | any;
  account$ = this.accountSubject.asObservable(); // ✅ Observable account
  profilePhotoUrl$ = new BehaviorSubject<string | null>(null); // ✅ Store photo URL reactively

  selectedFile: File | null = null;
  isAdmin = false;

  private accountService = inject(AccountService);
  private profileService = inject(ProfilephotoService);
  private snackBar = inject(MatSnackBar);
  private sanitizer = inject(DomSanitizer);

  constructor() {}

  ngOnInit(): void {
    this.loadAccountProfile();
    this.loadProfilePhotoFromStorage();
  }

  private loadAccountProfile(): void {
    this.accountService.getAccountProfile().pipe(
      switchMap((account) => {
        this.accountSubject.next(account); // ✅ Push new account data
        localStorage.setItem('email', account.email);

        return this.profile?.fileId
          ? this.loadProfilePhoto(this.profile.fileId)
          : of(null); // ✅ Return null if no profile
      }),
      catchError((err) => {
        console.error('Failed to load profile:', err);
        return of(null);
      })
    ).subscribe();
  }

  private loadProfilePhoto(fileId: string) {
    return this.profileService.getProfilePhoto(fileId).pipe(
      switchMap((blob) => {
        const url = window.URL.createObjectURL(blob);
        const safeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.profilePhotoUrl$.next(url);
        localStorage.setItem('profilePhotoUrl', url);
        return of(safeUrl);
      }),
      catchError((err) => {
        this.showSnackBar('Failed to load profile photo.', 'Close');
        console.error('Failed to load profile photo:', err);
        return of(null);
      })
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadProfilePhoto(): void {
    if (!this.selectedFile) {
      this.showSnackBar('Please select a file before uploading.', 'Close');
      return;
    }

    const email = localStorage.getItem('email');
    if (!email) {
      this.showSnackBar('Error: Email is required to upload a profile photo.', 'Close');
      return;
    }

    this.profileService.uploadProfilePhoto(this.selectedFile, email).pipe(
      switchMap((response) => {
        this.showSnackBar('Profile photo uploaded successfully.', 'Close');
        return response.fileId ? this.loadProfilePhoto(response.fileId) : of(null);
      }),
      catchError((err) => {
        this.showSnackBar('Error uploading profile photo.', 'Close');
        console.error('Upload error:', err);
        return of(null);
      })
    ).subscribe();
  }

  private loadProfilePhotoFromStorage(): void {
    const storedPhotoUrl = localStorage.getItem('profilePhotoUrl');
    if (storedPhotoUrl) {
      this.profilePhotoUrl$.next(storedPhotoUrl);
    }
  }

  deleteProfilePhoto(): void {
     // Check if profile exists and has a fileId
  if (!this.profile?.fileId) {
    this.showSnackBar('Error: File ID is required to delete the profile photo.', 'Close');
    return;
  }
  const fileId = this.profile.fileId;
  console.log('Deleting profile photo with fileId:', fileId);  // Check if fileId is logged

    this.profileService.deleteProfilePhoto(fileId).pipe(
      switchMap(() => {
        this.showSnackBar('Profile photo deleted successfully.', 'Close');
        this.profilePhotoUrl$.next(null);
        localStorage.removeItem('profilePhotoUrl');
        return of(null);
      }),
      catchError((err) => {
        this.showSnackBar('Error deleting profile photo.', 'Close');
        console.error('Delete error:', err);
        return of(null);
      })
    ).subscribe();
  }

  private showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
