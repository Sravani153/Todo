import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataBindingComponent } from './data-binding.component';
import { FormsModule } from '@angular/forms';

describe('DataBindingComponent', () => {
  let component: DataBindingComponent;
  let fixture: ComponentFixture<DataBindingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataBindingComponent ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataBindingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial message as "Hello, Angular!"', () => {
    expect(component.message).toBe('Hello, Angular!');
  });

  it('should change message when changeMessage() is called', () => {
    component.changeMessage();
    expect(component.message).toBe('You have changed the message!');
  });

  it('should display the initial message in the template', () => {
    fixture.detectChanges(); // Ensure view is updated before testing
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Hello, Angular!');
  });

  it('should display the updated message in the template after changeMessage() is called', () => {
    component.changeMessage();
    fixture.detectChanges(); // Trigger change detection after message change
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('You have changed the message!');
  });
});
