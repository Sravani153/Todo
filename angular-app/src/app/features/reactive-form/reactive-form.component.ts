import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormDisplayComponent } from '../reactive-form-display/reactive-form-display.component';

@Component({
  selector: 'app-reactive-form',
  standalone:true,
  imports:[   CommonModule,
      FormsModule,
      ReactiveFormDisplayComponent,
      ReactiveFormsModule
  ,],
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.css']
})
export class ReactiveFormComponent {
  form: FormGroup;
  submitted: boolean = false;
  formData: any;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      age: [''],
      dob: [''],
      password: ['']

    });
  }

  onSubmit() {
    this.submitted = true;
    alert('Form Submitted Successfully!');
    this.formData = this.form.value;
  }
}
