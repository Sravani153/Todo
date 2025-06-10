import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { AccountDTO } from 'src/app/model/AccountDTO';
import { AccountService } from 'src/app/services/account.service';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { CustomTableComponent } from '../custom-table/custom-table.component';
import { NavbarComponent } from '../todo/navbar/navbar.component';

@Component({
  selector: 'app-accounts',
  standalone:true,
  imports:[ CommonModule,
      MatTableModule,
      MatPaginatorModule,
      NavbarComponent,
      MatProgressSpinnerModule,
      CustomTableComponent,
      TranslateModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'role'];
  dataSource = new MatTableDataSource<AccountDTO>();
  selection = new SelectionModel<AccountDTO>(true, []);
  isAdmin: boolean = false;
  isLoading: boolean = false;

  constructor(private accountService: AccountService,
    private userStorage: UserstorageService,
    private snackBar: MatSnackBar,

  ) {}

  ngOnInit(): void {
    this.isAdmin = this.userStorage.isAdminLoggedIn();
    this.loadAccounts();
  }

  loadAccounts(): void {
    console.log('Loading accounts...');
    this.isLoading = true;
    this.accountService.getAllAccounts().subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response?.data) {
          this.dataSource.data = response.data.map(({ password, ...account }: AccountDTO) => account);
          this.showSnackBar('All Accounts loaded successfully.', 'Close');
        } else {
          console.error('Unexpected response structure:', response);
          this.showSnackBar('Failed to load accounts. Unexpected response format.', 'Close');
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error loading accounts:', error);
        this.showSnackBar('Failed to load all accounts.', 'Close');
      }
    );
  }

  private showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
