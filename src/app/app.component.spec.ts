import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { ErrorWindowComponent, ErrorHandlingService } from '@error-handling';
import { NgLoadingIndicatorModule, LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigService } from '@config';
import { ConfigServiceStub } from '@config/testing';
import { createErrorHandlingServiceSpy } from '@error-handling/testing';
import { MessageService } from 'primeng/api';
import { Router, Route } from '@angular/router';
import { RouteResolverStub } from '@test-helpers';
import { CreateLoadingIndicatorServiceSpy } from '@browninglogic/ng-loading-indicator/testing';
import { createMessageServiceSpy } from '@notifications/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let errorHandlingServiceSpy: jasmine.SpyObj<ErrorHandlingService>;
  let loadingIndicatorServiceSpy;
  let configServiceStub: ConfigServiceStub;
  let routeResolver: RouteResolverStub;
  let router: Router;

  beforeEach(async(() => {
    errorHandlingServiceSpy = createErrorHandlingServiceSpy();
    loadingIndicatorServiceSpy = CreateLoadingIndicatorServiceSpy();
    configServiceStub = new ConfigServiceStub();
    routeResolver = new RouteResolverStub();

    const dummyTestingRoutes: Array<Route> = [
      {
        path: '',
        component: AppComponent
      },
      {
        path: 'route-with-resolver',
        component: AppComponent,
        resolve: { routeData: RouteResolverStub }
      }
    ];

    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        NgLoadingIndicatorModule,
        ModalManagerModule,
        ToastModule,
        RouterTestingModule.withRoutes(dummyTestingRoutes)
      ],
      declarations: [
        AppComponent,
        ErrorWindowComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceStub },
        { provide: ErrorHandlingService, useValue: errorHandlingServiceSpy },
        { provide: MessageService, useValue: createMessageServiceSpy() },
        { provide: RouteResolverStub, useValue: routeResolver },
        { provide: LoadingIndicatorService, useValue: loadingIndicatorServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the app', () => {
    // Act: Init change detection to trigger ngOnInit
    fixture.detectChanges();
    expect(configServiceStub.initialized).toBe(true);

    // Assert: Ensure that the component was created and that nothing was passed to handleError
    expect(component).toBeTruthy();
    expect(errorHandlingServiceSpy.handleError).not.toHaveBeenCalled();
  });

  it('should properly handle config init failure', () => {
    // Arrange: Set the config service to a failed state
    configServiceStub.initialized = false;
    expect(errorHandlingServiceSpy.handleError).not.toHaveBeenCalled();

    // Act: Init change detection to trigger ngOnInit
    fixture.detectChanges();

    // Assert: Ensure that handleError was called with the appropriate comment
    expect(errorHandlingServiceSpy.handleError).toHaveBeenCalledTimes(1);
    expect(errorHandlingServiceSpy.handleError.calls.mostRecent().args[1]).toBe('Failed to load configuration');
  });

  it('should show loading indicator while resolving route data', fakeAsync(() => {
    // Arrange: Detect changes in order to trigger ngOnInit
    fixture.detectChanges();
    expect(loadingIndicatorServiceSpy.showLoadingIndicator).not.toHaveBeenCalled();

    // Act: Initiate route navigation to a dummy route with a dummy resolver
    router.navigate(['/route-with-resolver']);

    /* Assert: Ensure that while waiting for the route data to resolve the loading indicator
    has been shown and has not yet been hidden. */
    expect(loadingIndicatorServiceSpy.showLoadingIndicator).toHaveBeenCalledTimes(1);
    expect(loadingIndicatorServiceSpy.hideLoadingIndicator).not.toHaveBeenCalled();

    // Act: Complete the navigation by passing data to the route resolver
    routeResolver.routeData.next({});
    tick();
    // Assert: Ensure that the loading indicator has been hidden.
    expect(loadingIndicatorServiceSpy.showLoadingIndicator).toHaveBeenCalledTimes(1);
    expect(loadingIndicatorServiceSpy.hideLoadingIndicator).toHaveBeenCalledTimes(1);
  }));
});
