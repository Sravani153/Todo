import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { AccountDTO } from '../model/AccountDTO';
import { UserstorageService } from '../storage/userstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = `${environment.apiBaseUrl}/accounts`;


  constructor(
    private http: HttpClient,
    private userStorageServ: UserstorageService

  ) { }

createAccount(account: AccountDTO): Observable<AccountDTO> {
  return this.http.post<AccountDTO>(`${this.baseUrl}/add`, account, {
      headers: { 'Content-Type': 'application/json' }
  });
}

getAllAccounts(): Observable<AccountDTO[]> {
  return this.http.get<AccountDTO[]>(`${this.baseUrl}/`, {
    headers: this.createAuthorizationHeader()
  });
}

deleteAccount(email: string): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/delete/${email}`);
}


updateProfile(profile: AccountDTO): Observable<AccountDTO> {
  return this.http.put<AccountDTO>(`${this.baseUrl}/profile/update`, profile);
}


getAccountProfile(): Observable<AccountDTO> {
return this.http.get<AccountDTO>(`${this.baseUrl}/accProfile`, {
     headers: this.createAuthorizationHeader()
  });
}

private createAuthorizationHeader(): HttpHeaders {
  const token = this.userStorageServ.getToken();
  return new HttpHeaders().set('Authorization', `Bearer ${token}`);
}

}
