import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormComponent } from './reactive-form.component';
import { ReactiveFormDisplayModule } from '../reactive-form-display/reactive-form-display.module';

describe('ReactiveFormComponent', () => {
  let component: ReactiveFormComponent;
  let fixture: ComponentFixture<ReactiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveFormComponent],
      imports: [ReactiveFormsModule,
        ReactiveFormDisplayModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.form.value).toEqual({
      name: '',
      age: '',
      dob: '',
      password: ''
    });
  });

  it('should display success message on form submission', () => {
    spyOn(window, 'alert'); // Spy on the alert function

    component.form.setValue({
      name: 'John Doe',
      age: 30,
      dob: '1994-05-15',
      password: 'password123'
    });
    component.onSubmit();

    expect(component.submitted).toBeTrue();
    expect(window.alert).toHaveBeenCalledWith('Form Submitted Successfully!');
    expect(component.formData).toEqual(component.form.value);
  });

  it('should have form controls defined', () => {
    expect(component.form.contains('name')).toBeTrue();
    expect(component.form.contains('age')).toBeTrue();
    expect(component.form.contains('dob')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
  });
});
