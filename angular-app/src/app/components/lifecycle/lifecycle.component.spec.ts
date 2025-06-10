import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LifecycleComponent } from './lifecycle.component';
import { SimpleChange } from '@angular/core';

describe('LifecycleComponent', () => {
  let component: LifecycleComponent;
  let fixture: ComponentFixture<LifecycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LifecycleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifecycleComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log "OnInit: Component initialized." on ngOnInit', () => {
    spyOn(console, 'log');
    fixture.detectChanges(); // Triggers ngOnInit

    expect(console.log).toHaveBeenCalledWith('OnInit: Component initialized.');
  });

  it('should log "OnChanges: Component changes detected." when @Input() changes', () => {
    spyOn(console, 'log');

    // Simulate ngOnChanges by manually setting a change to @Input()
    component.ngOnChanges({
      sampleInput: new SimpleChange(null, 'newValue', false)
    });

    expect(console.log).toHaveBeenCalledWith('OnChanges: Component changes detected.', {
      sampleInput: jasmine.any(SimpleChange)
    });
  });

  it('should log "OnDestroy: Component destroyed." on ngOnDestroy', () => {
    spyOn(console, 'log');
    fixture.detectChanges(); // Triggers ngOnInit

    fixture.destroy(); // Triggers ngOnDestroy

    expect(console.log).toHaveBeenCalledWith('OnDestroy: Component destroyed.');
  });
});
