import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Item } from 'src/app/model/item.model';
import { UserstorageService } from 'src/app/storage/userstorage.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomTableComponent } from '../../custom-table/custom-table.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-item-list',
  standalone:true,
    imports: [
      CommonModule,
      RouterModule,
      MatToolbarModule,
      MatButtonModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      MatTableModule,
      FormsModule,
      HttpClientModule,
      ReactiveFormsModule,
      MatTableModule,
      MatPaginatorModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatSortModule,
      MatDialogModule,
      CdkTableModule,
      TranslateModule,
      MatMenuModule,
      NavbarComponent,
      CustomTableComponent
    ],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  @Input() displayedColumns: string[] = ["select", "name", "dob", "gender", "email", "phone", "bookmark", "actions"];

  items: Item[] = [];
  searchValue: string = '';
  isAdmin: boolean = false;
  isLoading: boolean = false;
  dataSource = new MatTableDataSource<Item>([]);
  selection = new SelectionModel<Item>(true, []);
  // searchSubject: Subject<string> = new Subject<string>();


  constructor(
    private router: Router,
    private itemService: ItemService,
    private snackBar: MatSnackBar,
    private userStorage: UserstorageService,
    private translate:TranslateService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.userStorage.isAdminLoggedIn();
    this.updateDisplayedColumns();
    this.loadItems();

    // Reactive Search Logic
    // this.searchSubject.pipe(
    //   debounceTime(1500),
    //   distinctUntilChanged(),
    //   switchMap((searchText: string) => {
    //     this.isLoading = true;
    //     return this.itemService.searchItems(searchText).pipe(
    //       retry(3),
    //       catchError(error => {
    //         this.isLoading = false;
    //         this.showSnackBar('SEARCH_FAILED', 'CLOSE');
    //         return of([]); // return empty array on failure
    //       })
    //     );
    //   })
    // ).subscribe((items: Item[]) => {
    //   this.isLoading = false;
    //   this.dataSource.data = items;
    //   this.showSnackBar('SAVED_SUCCESSFULLY', 'CLOSE');
    // });
  }


  updateDisplayedColumns(): void {
    if (!this.isAdmin) {
      this.displayedColumns = ['name', 'dob', 'gender', 'email', 'phone', 'bookmark'];
    }
  }

  // loadItems(): void {
  //   this.isLoading = true;
  //   this.itemService.getAllItems().subscribe(
  //     (response: any) => {
  //       if (response.state === 'Success' && response.data) {
  //         this.items = response.data; // Use the 'data' key
  //         this.dataSource.data = this.items;
  //         this.isLoading = false;
  //       } else {
  //         this.isLoading = false;
  //         this.showSnackBar('BOOKMARKS_LOADED_FAILURE', 'CLOSE');
  //       }
  //     },
  //     (error) => {
  //       this.isLoading = false;
  //       this.showSnackBar('BOOKMARKS_LOADED_FAILURE', 'CLOSE');
  //     }
  //   );
  // }

  loadItems(): void {
    this.isLoading = true;
    this.itemService.getAllItems().subscribe(
      (items: Item[]) => {
        this.items = items;
        this.dataSource.data = this.items;
        this.isLoading = false;
        this.showSnackBar('ITMES_LOADED_SUCCESS.', 'Close');
      },
      (error) => {
        this.isLoading = false;
        this.showSnackBar('BOOKMARKS_LOADED_FAILURE', 'Close');
      }
    );
  }


  onEdit(id: string): void {
    this.isLoading=true;
    this.router.navigate(['/add'], { queryParams: { id } });
  }

  onDelete(id: string): void {
    const confirmation = confirm(this.translate.instant('CONFIRM_DELETE'));
    if (confirmation) {
      this.isLoading = true;
      this.itemService.deleteItem(id).subscribe(
        () => {
          this.isLoading=false;
          this.showSnackBar('ITEM_DELETED_SUCCESS', 'CLOSE');
          this.loadItems();
        },
        (error) => {
          this.isLoading = false;
          this.showSnackBar('ITEM_DELETED_FAILURE', 'CLOSE');
        }
      );
    } else {
      this.showSnackBar('DELETE_OPERATION_CANCELLED', 'CLOSE');
    }
  }

  exportToExcel(): void {
    const filteredItems = this.dataSource.filteredData as Item[];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredItems.map(item => ({
      NAME: item.name,
      DOB: item.dob,
      GENDER: item.gender,
      EMAIL: item.email,
      PHONES: item.phone.join(', '),
      BOOKMARK: item.bookmark ? 'Yes' : 'No',
    })));

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Items');
    XLSX.writeFile(wb, 'items.xlsx');
  }

  exportToPdf(): void {
    const filteredItems = this.dataSource.filteredData as Item[];

    const doc = new jsPDF();

    // doc.text('Exported Items', 14, 10);
    doc.text(this.translate.instant('EXPORT_TITLE'), 14, 10);

    const tableData = filteredItems.map((item) => [
      item.name,
      item.dob,
      item.gender,
      item.email,
      item.phone.join(', '),
      // item.bookmark ? 'Yes' : 'No',
     this.translate.instant(item.bookmark ? 'YES' : 'NO'),

    ]);

    (doc as any).autoTable({
      head: [[
        this.translate.instant('NAME'),
        this.translate.instant('DOB'),
        this.translate.instant('GENDER'),
        this.translate.instant('EMAIL'),
        this.translate.instant('PHONES'),
        this.translate.instant('BOOKMARK')
      ]],

      body: tableData,
      startY: 20,
    });

    doc.save('items.pdf');
  }

  deleteSelected(): void {
    const selectedIds = this.selection.selected.map((item) => (item as any).id as string);

    if (selectedIds.length === 0) {
      this.showSnackBar('NO_ITEMS_SELECTED_FOR_DELETION', 'CLOSE');
      return;
    }

    // const confirmation = confirm(`Are you sure you want to delete ${selectedIds.length} items?`);
    const confirmation = confirm(this.translate.instant('CONFIRM_DELETE_SELECTED', { count: selectedIds.length }));
    if (confirmation) {
      this.isLoading = true;
      this.itemService.deleteItems(selectedIds).subscribe(
        () => {
          this.isLoading = false;
          this.showSnackBar('SELECTED_ITEMS_DELETED', 'CLOSE');
          this.loadItems();
          this.selection.clear();
        },
        () => {
          this.showSnackBar('DELETE_SELECTED_ITEMS_FAILURE', 'CLOSE');
          this.isLoading = false;
        }
      );
    }
  }

  toggleBookmarked(item: Item): void {
    const updatedBookmarkStatus = !item.bookmark;

    item.bookmark = updatedBookmarkStatus;

    this.dataSource.data = [...this.dataSource.data]; // Trigger re-render
    this.isLoading=true;
    this.itemService.toggleBookmark(item.id, updatedBookmarkStatus).subscribe(
      (updatedItem: Item) => {
        const index = this.items.findIndex(i => i.id === updatedItem.id);
        if (index !== -1) {
          this.items[index] = updatedItem;
          this.dataSource.data = [...this.items];
        }
        this.isLoading=false;
        // this.showSnackBar(`Bookmark status updated to ${updatedBookmarkStatus ? 'bookmark' : 'unbookmark'}.`, 'Close');
        this.showSnackBar(`BOOKMARK_STATUS_UPDATED_${updatedBookmarkStatus ? 'YES' : 'NO'}`, 'CLOSE');

      },
      (error) => {
        this.isLoading = false;
        // item.bookmark = !updatedBookmarkStatus;
        // this.dataSource.data = [...this.dataSource.data];
        this.showSnackBar('BOOKMARK_UPDATE_FAILURE', 'CLOSE');
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.dataSource.filterPredicate = (data: Item, filter: string): boolean => {
      return this.matchesName(data, filter) || this.matchesDateOfBirth(data, filter);
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length === 0) {
      this.showSnackBar('NO_RESULTS_FOUND', 'CLOSE');
    }

  }


  private matchesName(data: Item, filter: string): boolean {
    return data.name.toLowerCase().includes(filter);
  }

  private matchesDateOfBirth(data: Item, filter: string): boolean {
    const dob = new Date(data.dob);
    const dobString = `${dob.getMonth() + 1} ${dob.getDate()} ${dob.getFullYear()}`.toLowerCase();
    const dobMonthName = dob.toLocaleString('default', { month: 'short' }).toLowerCase();
    return dobString.includes(filter) || dobMonthName.includes(filter);
  }

  clearSearch(): void {
    this.searchValue = '';
      this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
      this.showSnackBar('SEARCH_CLEARED', 'CLOSE');
  }


  public showSnackBar(messageKey: string, actionKey: string): void {
    this.translate.get([messageKey, actionKey]).subscribe((translations) => {
      this.snackBar.open(translations[messageKey], translations[actionKey], {
        duration: 3000
      });
    });
  }
}
