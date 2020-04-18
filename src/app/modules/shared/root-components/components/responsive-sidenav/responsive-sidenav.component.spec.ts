import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsiveSidenavComponent } from './responsive-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Route, Router } from '@angular/router';
import { WindowService } from '@core/services/application';
import { WindowServiceStub } from '@core/testing';
import theoretically from 'jasmine-theories';

describe('ResponsiveSidenavComponent', () => {
  let component: ResponsiveSidenavComponent;
  let fixture: ComponentFixture<ResponsiveSidenavComponent>;
  let windowService: WindowServiceStub;
  let router: Router;

  const dummyTestingRoutes: Route[] = [
    { path: '', component: ResponsiveSidenavComponent },
    { path: 'route2', component: ResponsiveSidenavComponent }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsiveSidenavComponent ],
      imports: [
        MatSidenavModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(dummyTestingRoutes)
      ],
      providers: [
        { provide: WindowService, useClass: WindowServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSidenavComponent);
    windowService = TestBed.inject(WindowService);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize properly on a small screen', () => {
    // Arrange: Set the screen width
    windowService.innerWidth = 799;

    // Act: Init the component
    fixture.detectChanges();

    // Assert that the sidenav is as expected for a small screen
    expect(component.smallScreen).toBe(true);
    expect(component.sideNav.opened).toBe(false);
    expect(component.sideNav.mode).toBe('over');
  });

  it('should initialize properly on a large screen', () => {
    // Arrange: Set the screen width
    windowService.innerWidth = 800;

    // Act: Init the component
    fixture.detectChanges();

    // Assert that the sidenav is as expected for a large screen
    expect(component.smallScreen).toBe(false);
    expect(component.sideNav.opened).toBe(true);
    expect(component.sideNav.mode).toBe('side');
  });

  it('should show and hide the sidenav as the user resizes the screen', () => {
    // Arrange: Define some test values & expectations
    const testEntries = [
      { screenSize: 799, shouldShowSidenav: false },
      { screenSize: 800, shouldShowSidenav: true },
      { screenSize: 300, shouldShowSidenav: false },
      { screenSize: 1200, shouldShowSidenav: true }
    ];

    // For each test entry
    testEntries.forEach(testEntry => {
      // Arrange: Set the screen width
      windowService.innerWidth = testEntry.screenSize;
      windowService.resize.emit();
      fixture.detectChanges();

      // Assert that the sidenav state matches our expectation
      expect(component.sideNav.opened).toBe(testEntry.shouldShowSidenav);
    });
  });

  const nonDefaultCutoffInput = [
    { screenSize: 699, shouldShowSidenav: false },
    { screenSize: 700, shouldShowSidenav: true }
  ];
  theoretically.it('should properly use provided non-default values for screenSizeCutoff', nonDefaultCutoffInput, (input) => {
    // Arrange
    // Set up test entries for a small & large screen
    // Specify an arbitrary screenSizeCutoff
    component.screenSizeCutoff = 700;

    // Arrange: Set the screen width
    windowService.innerWidth = input.screenSize;
    // Act: Detect changes
    fixture.detectChanges();
    // Assert that the sidenav state matches our expectation
    expect(component.sideNav.opened).toBe(input.shouldShowSidenav);
  });

  it('should properly toggle the sidenav when told to do so', () => {
    // Arrange: Specify the screen width & detect changes
    windowService.innerWidth = 600;
    fixture.detectChanges();
    expect(component.sideNav.opened).toBe(false);

    /* Act & Assert: Toggle the screen a few times and check
    that the sideNav toggled appropriately. */
    component.toggle();
    expect(component.sideNav.opened).toBe(true);
    component.toggle();
    expect(component.sideNav.opened).toBe(false);
  });

  it('should close the sidenav on navigation on small screens', () => {
    // Arrange: Set a small screen width, init the component, and show the sideNav
    windowService.innerWidth = 600;
    fixture.detectChanges();
    component.toggle();
    expect(component.sideNav.opened).toBe(true);

    // Act: Perform a dummy navigation
    router.navigate(['/route2']);

    // Assert that the sideNav closed appropriately
    expect(component.sideNav.opened).toBe(false);

  });

  it('should not close the sidenav on navigation on large screens', () => {
    // Arrange: Set a large screen width & init the component
    windowService.innerWidth = 900;
    fixture.detectChanges();
    expect(component.sideNav.opened).toBe(true);

    // Act: Perform a dummy route navigation
    router.navigate(['/route2']);

    // Assert that the sideNav closed appropriately
    expect(component.sideNav.opened).toBe(true);
  });
});
