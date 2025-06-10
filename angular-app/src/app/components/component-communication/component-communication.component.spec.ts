import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentCommunicationComponent } from './component-communication.component';
import { ChildComponent } from '../child/child.component';
import { By } from '@angular/platform-browser';

describe('ComponentCommunicationComponent', () => {
  let component: ComponentCommunicationComponent;
  let fixture: ComponentFixture<ComponentCommunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComponentCommunicationComponent, ChildComponent ] // Declare both parent and child components
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentCommunicationComponent);
    component = fixture.componentInstance;
  });

  it('should create the parent component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the message from parent in parent component', () => {
    fixture.detectChanges(); // Trigger change detection

    const parentMessageElement = fixture.debugElement.query(By.css('.parent p')).nativeElement;
    expect(parentMessageElement.textContent).toContain('Message from Parent: Hello from parent!');
  });

  it('should display the message from parent in child component', () => {
    fixture.detectChanges(); // Trigger change detection

    const childMessageElement = fixture.debugElement.query(By.css('app-child p')).nativeElement;
    expect(childMessageElement.textContent.trim()).toBe('Hello from parent!'); // Ensure this matches exactly
  });
});
