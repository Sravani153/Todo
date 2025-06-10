import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DirectivesComponent } from './directives.component';

describe('DirectivesComponent', () => {
  let component: DirectivesComponent;
  let fixture: ComponentFixture<DirectivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial items array with three items', () => {
    expect(component.items.length).toBe(3);
    expect(component.items).toEqual(['Item 1', 'Item 2', 'Item 3']);
  });

  it('should have initial showMessage set to true', () => {
    expect(component.showMessage).toBeTrue();
  });

  it('should toggle showMessage when toggleMessage() is called', () => {
    component.toggleMessage();
    expect(component.showMessage).toBeFalse();
    component.toggleMessage(); // Toggle back
    expect(component.showMessage).toBeTrue();
  });

  it('should have initial isRed set to true', () => {
    expect(component.isRed).toBeTrue();
  });

  it('should toggle isRed when toggleClass() is called', () => {
    component.toggleClass();
    expect(component.isRed).toBeFalse();
    component.toggleClass(); // Toggle back
    expect(component.isRed).toBeTrue();
  });

  it('should display the correct number of items in the template', () => {
    const compiled = fixture.nativeElement;
    const itemList = compiled.querySelectorAll('li');
    expect(itemList.length).toBe(3); // Expecting three items
  });

  it('should display message when showMessage is true', () => {
    const compiled = fixture.nativeElement;
    const messageElement = compiled.querySelector('p'); // Directly select the <p> element
    expect(messageElement?.textContent).toContain('This is a conditional message.');
  });

  // it('should not display message when showMessage is false', () => {
  //   component.toggleMessage(); // Set to false
  //   fixture.detectChanges(); // Update the view
  //   const compiled = fixture.nativeElement;
  //   const messageElement = compiled.querySelector('p');
  //   expect(messageElement).toBeNull(); // Expect the <p> element to be removed
  // });

  it('should have the correct class based on isRed', () => {
    component.toggleClass(); // Set isRed to false
    fixture.detectChanges(); // Update the view
    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('p.red-text'); // The <p> element with ngClass applied
    expect(element).toBeNull(); // Shouldn't have the 'red-text' class when isRed is false

    component.toggleClass(); // Set isRed back to true
    fixture.detectChanges(); // Update the view
    const redElement = compiled.querySelector('p.red-text');
    expect(redElement).not.toBeNull(); // Should now have the 'red-text' class when isRed is true
  });
});
