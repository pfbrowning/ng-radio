import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResponsiveSidenavComponent } from './responsive-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WindowToken } from '../../injection-tokens/window-token';
import { WindowStub } from '../../testing/window.stub';
import { Route, Router } from '@angular/router';

describe('ResponsiveSidenavComponent', () => {
  let component: ResponsiveSidenavComponent;
  let fixture: ComponentFixture<ResponsiveSidenavComponent>;
  let window: WindowStub;
  let router: Router;

  const dummyTestingRoutes: Array<Route> = [
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
        { provide: WindowToken, useClass: WindowStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveSidenavComponent);
    window = TestBed.get(WindowToken);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize properly on a small screen', () => {
    // Arrange: Set the screen width
    window.innerWidth = 799;

    // Act: Init the component
    fixture.detectChanges();

    // Assert that the sidenav is as expected for a small screen
    expect(component.smallScreen).toBe(true);
    expect(component.sideNav.opened).toBe(false);
    expect(component.sideNav.mode).toBe('over');
  });

  it('should initialize properly on a large screen', () => {
    // Arrange: Set the screen width
    window.innerWidth = 800;

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
      window.innerWidth = testEntry.screenSize;
      // Act: Trigger change detection
      fixture.detectChanges();
      // Assert that the sidenav state matches our expectation
      expect(component.sideNav.opened).toBe(testEntry.shouldShowSidenav);
    });
  });

  it('should properly use provided non-default values for screenSizeCutoff', () => {
    // Arrange
    // Set up test entries for a small & large screen
    const testEntries = [
      { screenSize: 699, shouldShowSidenav: false },
      { screenSize: 700, shouldShowSidenav: true }
    ];
    // Specify an arbitrary screenSizeCutoff
    component.screenSizeCutoff = 700;

    // For each test entry
    testEntries.forEach(testEntry => {
      // Arrange: Set the screen width
      window.innerWidth = testEntry.screenSize;
      // Act: Detect changes
      fixture.detectChanges();
      // Assert that the sidenav state matches our expectation
      expect(component.sideNav.opened).toBe(testEntry.shouldShowSidenav);
    });
  });

  it('should properly toggle the sidenav when told to do so', () => {
    // Arrange: Specify the screen width & detect changes
    window.innerWidth = 600;
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
    window.innerWidth = 600;
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
    window.innerWidth = 900;
    fixture.detectChanges();
    expect(component.sideNav.opened).toBe(true);

    // Act: Perform a dummy route navigation
    router.navigate(['/route2']);

    // Assert that the sideNav closed appropriately
    expect(component.sideNav.opened).toBe(true);
  });
});
