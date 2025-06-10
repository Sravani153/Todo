import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserstorageService } from '../storage/userstorage.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilephotoService {
  private baseUrl = `${environment.apiBaseUrl}/api/files`;

  private profilePhotoUrl = new BehaviorSubject<string | null>(null);
  profilePhotoUrl$ = this.profilePhotoUrl.asObservable();

  constructor(private http: HttpClient, private userStorageServ: UserstorageService) {}

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.userStorageServ.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  uploadProfilePhoto(file: File, email: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);
    const headers = this.createAuthorizationHeader();
    return this.http.post(`${this.baseUrl}/upload`, formData, { headers });
  }

  getProfilePhoto(fileId: string): Observable<Blob> {
    const headers = this.createAuthorizationHeader();
    return this.http.get<Blob>(`${this.baseUrl}/photo/${fileId}`, {
      headers,
      responseType: 'blob' as 'json' ,
        });
  }

  setProfilePhotoUrl(url: string): void {
    this.profilePhotoUrl.next(url);
  }

  deleteProfilePhoto(fileId: string) {
    const headers = this.createAuthorizationHeader();
    return this.http.delete(`${this.baseUrl}/photo/${fileId}`, { headers });
  }
}
