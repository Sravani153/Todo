import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormDisplayComponent } from './reactive-form-display.component';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { CustomPipe } from 'src/app/pipes/custom.pipe';
import { MaskPipePipe } from 'src/app/pipes/mask-pipe.pipe';

describe('ReactiveFormDisplayComponent', () => {
  let component: ReactiveFormDisplayComponent;
  let fixture: ComponentFixture<ReactiveFormDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReactiveFormDisplayComponent,
        CustomPipe,
        MaskPipePipe
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactiveFormDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formData as undefined', () => {
    expect(component.formData).toBeUndefined();
  });


  it('should detect input changes', () => {
    component.formData = {
      name: 'Jane Doe',
      age: 28,
      dob: '1995-10-20',
      password: 'mypassword'
    };

    const changes: SimpleChanges = {
      formData: new SimpleChange(undefined, component.formData, true) // Pass correct parameters here
    };

    component.ngOnChanges(changes);

    expect(component.formData.name).toBe('Jane Doe');
  });

  it('should log OnInit when initialized', () => {
    spyOn(console, 'log');
    component.ngOnInit();
    expect(console.log).toHaveBeenCalledWith('OnInit: ReactiveFormDisplayComponent initialized.');
  });

  it('should log OnDestroy when destroyed', () => {
    spyOn(console, 'log');
    component.ngOnDestroy();
    expect(console.log).toHaveBeenCalledWith('OnDestroy: ReactiveFormDisplayComponent destroyed.');
  });
});
