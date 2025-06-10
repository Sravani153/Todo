import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-directives',
  standalone:true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      DirectivesComponent,
      MatFormFieldModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatIconModule,
      MatTableModule,
      MatSelectModule,
      MatRadioModule,
      MatToolbarModule,
      MatTabsModule,
      MatSnackBarModule,
      HttpClientModule,
    ],
  templateUrl: './directives.component.html',
  styleUrls:['./directives.component.css']

})
export class DirectivesComponent {
  items: string[] = ['Item 1', 'Item 2', 'Item 3'];
  showMessage: boolean = true;
  color: string = 'red';
  isRed: boolean = true;

  toggleMessage() {
    this.showMessage = !this.showMessage;
  }

  toggleClass() {
    this.isRed = !this.isRed;
  }
}
