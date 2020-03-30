import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { NgLoadingIndicatorModule, LoadingIndicatorService } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigServiceStub } from '@config/testing';
import { createErrorHandlingServiceSpy } from '@error-handling/testing';
import { Router, Route } from '@angular/router';
import { RouteResolverStub } from '@utilities/testing';
import { CreateLoadingIndicatorServiceSpy } from '@browninglogic/ng-loading-indicator/testing';
import { AudioElementEventListenerService } from '@core';
import { createAudioElementEventListenerSpy } from '@core/testing';
import { createOauthEventListenerServiceSpy } from '@authentication/testing';
import { OauthEventListenerService } from '@authentication';
import { ErrorHandlingService, ErrorWindowComponent } from '@error-handling';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loadingIndicatorServiceSpy;
  let configServiceStub: ConfigServiceStub;
  let routeResolver: RouteResolverStub;
  let router: Router;

  beforeEach(async(() => {
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
        { provide: RouteResolverStub, useValue: routeResolver },
        { provide: LoadingIndicatorService, useValue: loadingIndicatorServiceSpy },
        { provide: AudioElementEventListenerService, useValue: createAudioElementEventListenerSpy() },
        { provide: OauthEventListenerService, useValue: createOauthEventListenerServiceSpy() },
        { provide: ErrorHandlingService, useValue: createErrorHandlingServiceSpy() },
        MessageService
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

    // Assert
    expect(component).toBeTruthy();
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
