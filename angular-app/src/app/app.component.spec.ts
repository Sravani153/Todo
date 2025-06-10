import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule] // Import RouterTestingModule to mock routing
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-app'`, () => {
    expect(app.title).toEqual('angular-app');
  });

  it('should have navigation links with correct routerLinks', () => {
    const navLinks = fixture.debugElement.queryAll(By.css('nav a'));

    const routes = [
      '/intro',
      '/data-binding',
      '/directives',
      '/lifecycle',
      '/reactive-form',
      '/signup'
    ];

    expect(navLinks.length).toBe(routes.length); // Check if the number of links matches

    navLinks.forEach((link, index) => {
      expect(link.attributes['ng-reflect-router-link']).toBe(routes[index]); // Check routerLink values
    });
  });

  it('should contain a <router-outlet>', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).not.toBeNull();
  });



});
