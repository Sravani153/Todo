import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserstorageService {
  constructor(private router: Router) { }

  private readonly TOKEN_KEY = 'authToken';

  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.parseJwt(token);
      return payload?.role || null;
    }
    return null;
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (token) {
      const payload = this.parseJwt(token);
      return payload?.email || null;
    }
    return null;
  }
    // Method to check if the user is an admin
    isAdminLoggedIn(): boolean {
      return this.getUserRole() === 'ADMIN';
    }

    // Method to check if the user is a regular user
    isUserLoggedIn(): boolean {
      return this.getUserRole() === 'USER';
    }

    isAuthenticated(): boolean {
      return !!this.getToken();
    }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  private parseJwt(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).replace(/(.{2})/g, '$1'));
    return JSON.parse(base64);
  }
}
