import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError, throwError, Observable, of, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { UserstorageService } from '../storage/userstorage.service';
import { Router } from '@angular/router';
import { AccountDTO } from '../model/AccountDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userStorageServ: UserstorageService
  ) { }

  login(email: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { email, password };

    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, body, { headers }).pipe(
      map((response) => {
        if (response.token) {
          this.userStorageServ.storeToken(response.token);
          // localStorage.setItem('userId', response.userId);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.error('Token is blacklisted or invalid');
          this.userStorageServ.clearSession();
          this.router.navigate(['/login']);
        } else {
          console.error('Login error', error);
        }
        return of(false);
      })
    );
  }

    logout(): Observable<any> {
      const token = this.userStorageServ.getToken();
      if (!token) {
        return of(null);
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.post(`${this.baseUrl}/logout`, {}, { headers, responseType: 'text' as 'json' }).pipe(
        map((response) => {
          this.userStorageServ.clearSession();
          this.router.navigate(['/login']);
        }),
        catchError((error) => {
          console.error('Logout error', error);
          return of(null);
        })
      );
    }


}
