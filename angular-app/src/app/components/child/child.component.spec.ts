import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChildComponent } from './child.component';
import { By } from '@angular/platform-browser';

describe('ChildComponent', () => {
  let component: ChildComponent;
  let fixture: ComponentFixture<ChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildComponent);
    component = fixture.componentInstance;
  });

  it('should create the child component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message from parent', () => {
    const testMessage = 'Hello from parent!';
    component.message = testMessage;
    fixture.detectChanges(); // Trigger change detection

    const messageElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(messageElement.textContent).toContain(`${testMessage}`);
  });

  it('should have the h3 title "Child Component"', () => {
    fixture.detectChanges(); // Trigger change detection

    const titleElement = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(titleElement.textContent).toBe('Child Component');
  });
});
