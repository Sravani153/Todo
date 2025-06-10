import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ErrorLog } from '../model/ErrorLog';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {

  private readonly API_URL = '/admin/logs';

  constructor(private http: HttpClient) {}

  getAllErrorLogs(): Observable<ErrorLog[]> {
    return this.http.get<any>(this.API_URL).pipe(
      map(res => res.data as ErrorLog[]) // Adjust according to your actual response structure
    );
  }
}
