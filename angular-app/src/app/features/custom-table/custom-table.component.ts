import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/app/model/item.model';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-custom-table',
  standalone:true,
    imports: [
      CommonModule,
      MatToolbarModule,
      MatButtonModule,
      RouterModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatSortModule,
      MatDialogModule,
      TranslateModule,
     ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent<T> implements OnInit {
  @Input() dataSource: MatTableDataSource<T> = new MatTableDataSource<T>();
  @Input() displayedColumns: string[] = [];
  @Input() selection: SelectionModel<T>;
  @Input() isBookmarkedPage: boolean = false;

  @Output() toggleBookmark = new EventEmitter<T>();
  @Output() editItem = new EventEmitter<string>();
  @Output() deleteItem = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  items: Item[] = [];
  bookmarkedItems: Item[] = [];
  @Input() isLoading: boolean = false;
  isAdmin: boolean = false;
  @Input() shouldLoadItems: boolean = true;


  constructor(private itemService: ItemService, private snackBar: MatSnackBar, private userStorage: UserstorageService) {
    this.dataSource = new MatTableDataSource<T>();
    this.selection = new SelectionModel<T>(true, []);
  }

  ngOnInit(): void {
    this.isAdmin = this.userStorage.isAdminLoggedIn();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator=this.paginator;
    if (this.shouldLoadItems) {
      this.loadItems();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator=this.paginator;
      this.sort.active = 'name';
      this.sort.direction = 'asc';
    });
  }

  getColumnTranslationKey(column: string): string {
    const columnTranslations: { [key: string]: string } = {
      select: 'SELECT',
      name: 'NAME',
      dob: 'DOB',
      gender: 'GENDER',
      email: 'EMAIL',
      phone: 'PHONE',
      bookmark: 'BOOKMARK',
      actions: 'ACTIONS',
      role:'ROLE'
    };
    return columnTranslations[column] || column;
  }

  loadItems(): void {
    this.isLoading = true;
    this.itemService.getAllItems().subscribe(
      (items: Item[]) => {
        this.items = items;
        // If it's the Bookmarked page, filter only bookmarked items
        if (this.isBookmarkedPage) {
          this.bookmarkedItems = items.filter(item => item.bookmark);
          this.dataSource.data = this.bookmarkedItems as unknown as T[];
        } else {
          this.dataSource.data = this.items as unknown as T[];
        }
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
        this.showSnackBar('Items loaded successfully.', 'Close');
      },
      (error) => {
        this.isLoading = false;
        this.showSnackBar('Failed to load items.', 'Close');
      }
    );
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise, clear selection. */
  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  onToggleBookmark(element: T): void {
    this.toggleBookmark.emit(element);
  }

  onEdit(id: string): void {
    this.editItem.emit(id);
  }

  onDelete(id: string): void {
    this.deleteItem.emit(id);
  }

  public showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
