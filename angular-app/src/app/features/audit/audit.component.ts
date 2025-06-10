import { CommonModule } from '@angular/common';
import { Component , Signal,signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AuditService } from 'src/app/services/audit.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { NavbarComponent } from '../todo/navbar/navbar.component';

@Component({
  selector: 'app-audit',
  standalone:true,
  imports:[  CommonModule,
          MatButtonModule,
          MatIconModule,
          MatFormFieldModule,
          MatInputModule,
          MatTableModule,
          MatCardModule,
          NavbarComponent],
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent {
  auditLogs: any[] = [];
  isAdmin= signal<boolean>(false);

  constructor(private auditService: AuditService, private userStorage:UserstorageService ) {}

  displayedColumns: string[] = ['userId', 'fieldName', 'oldValue', 'newValue', 'updatedBy', 'updatedAt','action'];


  ngOnInit(): void {
    this.isAdmin.set(this.userStorage.isAdminLoggedIn());

    // Fetch all audit logs on component load
    this.auditService.getAllAuditLogs().subscribe(data => {
      // Sort the logs by updatedAt in descending order to show the latest on top
      this.auditLogs = data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
  }


}
