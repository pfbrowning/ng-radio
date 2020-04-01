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
import { ErrorHandlingService, ErrorWindowComponent } from '@error-handling';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let configServiceStub: ConfigServiceStub;
  let routeResolver: RouteResolverStub;
  let router: Router;

  beforeEach(async(() => {
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
});
