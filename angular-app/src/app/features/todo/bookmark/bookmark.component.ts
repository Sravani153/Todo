import { Component, OnInit, ViewChild, Signal, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Item } from 'src/app/model/item.model';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavbarComponent } from '../navbar/navbar.component';
import { CustomTableComponent } from '../../custom-table/custom-table.component';

@Component({
  selector: 'app-bookmark',
  standalone:true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatIconModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CustomTableComponent,
    NavbarComponent
  ],
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit {
  bookmarkedItems: MatTableDataSource<Item> = new MatTableDataSource<Item>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'dob', 'gender', 'email', 'phone', 'actions'];
  isAdmin: boolean = false;
  isLoading: boolean = false;
  selection = new SelectionModel<Item>(true, []);

  constructor(
    private router: Router,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private userStorage: UserstorageService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.userStorage.isAdminLoggedIn();
    this.updateDisplayedColumns();
    this.loadBookmarkedItems();
  }

  loadBookmarkedItems(): void {
    this.isLoading = true;
    this.itemService.getBookmarkedItems().subscribe(
      (items: Item[]) => {
        const bookmarked = items.filter(item => item.bookmark);
        this.bookmarkedItems = new MatTableDataSource(bookmarked);
        this.bookmarkedItems.paginator = this.paginator;
        this.bookmarkedItems.sort = this.sort;
        this.isLoading = false;
        this.snackBar.open('Bookmarked items loaded successfully.', 'Close', { duration: 3000 });
      },
      (error) => {
        console.error('Failed to load bookmarked items');
        this.isLoading = false;
        this.snackBar.open('Failed to load bookmarked items.', 'Close', { duration: 3000 });
      }
    );
  }

  handleToggleBookmark(updatedItem: Item): void {
    if (updatedItem.bookmark) {
      this.bookmarkedItems.data.push(updatedItem); // Add to the data source
    } else {
      this.bookmarkedItems.data = this.bookmarkedItems.data.filter(item => item.id !== updatedItem.id); // Remove from the data source
    }
  }

  updateDisplayedColumns(): void {
    if (!this.isAdmin) {
      this.displayedColumns = ['name', 'dob', 'gender', 'email', 'phone'];
    }
  }

  onEdit(id: string): void {
    this.isLoading = true;
    this.router.navigate(['/add'], { queryParams: { id } });
  }

  onDelete(id: string): void {
    const confirmation = confirm('Are you sure you want to delete this item?');
    if (confirmation) {
      this.isLoading = true;
      this.itemService.deleteItem(id).subscribe(() => {
        this.showSnackBar('Item deleted successfully!', 'Close');
        this.loadBookmarkedItems();
      });
    } else {
      this.snackBar.open('Delete operation canceled', 'Close', {
        duration: 3000,
      });
    }
  }

  private showSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
}
