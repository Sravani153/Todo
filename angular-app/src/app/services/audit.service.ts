import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { UserstorageService } from '../storage/userstorage.service';
import { UserAudit } from '../model/UserAudit';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private baseUrl = `${environment.apiBaseUrl}/audit`;

  constructor(
    private http: HttpClient,
    private userStorageServ: UserstorageService,
    private snackBar: MatSnackBar
  ) {}

  getAllAuditLogs(): Observable<UserAudit[]> {
    return this.http.get<UserAudit[]>(`${this.baseUrl}/alllogs`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      tap((logs) => this.handleLogs(logs))
    );
  }

  getAuditLogsForUser(userId: number): Observable<UserAudit[]> {
    return this.http.get<UserAudit[]>(`${this.baseUrl}/${userId}`, {
      headers: this.createAuthorizationHeader()
    }).pipe(
      tap((logs) => this.handleLogs(logs))
    );
  }

  // private handleLogs(logs: UserAudit[]): void {
  //   const fieldUpdates: string[] = [];

  //   logs.forEach(log => {
  //     let message: string | undefined;

  //     switch (log.action) {
  //       case 'create':
  //         message = `Field: ${log.fieldName} with ID: ${log.id} has been created.`;
  //         this.showSnackbar(message);  // Immediately show the snackbar for create action
  //         break;

  //       case 'update':
  //         // Track all updated fields for an update action
  //         fieldUpdates.push(`Field: ${log.fieldName} with ID: ${log.id} updated from "${log.oldValue}" to "${log.newValue}".`);
  //         break;

  //       case 'delete':
  //         message = `Field: ${log.fieldName} with ID: ${log.id} has been deleted.`;
  //         this.showSnackbar(message);  // Immediately show the snackbar for delete action
  //         break;

  //       default:
  //         message = `Action: ${log.action} performed on Field: ${log.fieldName} with ID: ${log.id}.`;
  //         this.showSnackbar(message);  // Show the snackbar for any other action
  //     }
  //   });

  //   // Show snackbar for all updates after processing all logs
  //   if (fieldUpdates.length > 0) {
  //     this.showSnackbar(fieldUpdates.join(' '));  // Combine all updated fields in one message
  //   }
  // }

  private handleLogs(logs: UserAudit[]): void {
    const fieldUpdates: string[] = [];

    logs.forEach(log => {
      let message: string | undefined;

      switch (log.action) {
        case 'create':
          // Construct message for 'create' action using all relevant fields
          message = `Field: ${log.fieldName} (ID: ${log.id}) has been created with the following values: ` +
                    `Old Value: "${log.oldValue}", New Value: "${log.newValue}", ` +
                    `Updated By: ${log.updatedBy}, Date: ${log.updatedAt}.`;
          this.showSnackbar(message);  // Immediately show the snackbar for create action
          break;

        case 'update':
          // Track all updated fields for an update action
          fieldUpdates.push(`Field: ${log.fieldName} (ID: ${log.id}) updated from "${log.oldValue}" to "${log.newValue}".`);
          break;

        case 'delete':
          message = `Field: ${log.fieldName} (ID: ${log.id}) has been deleted.`;
          this.showSnackbar(message);  // Immediately show the snackbar for delete action
          break;

        default:
          message = `Action: ${log.action} performed on Field: ${log.fieldName} (ID: ${log.id}).`;
          this.showSnackbar(message);  // Show the snackbar for any other action
      }
    });

    if (fieldUpdates.length > 0) {
      this.showSnackbar(fieldUpdates.join(' '));  // Combine all updated fields in one message
    }
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.userStorageServ.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'bottom'
    });
  }
}
