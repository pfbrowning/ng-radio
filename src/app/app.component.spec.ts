import { TestBed, async, ComponentFixture} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material';
import { ErrorWindowComponent, ErrorHandlingService } from '@modules/core/error-handling/error-handling.module';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigService } from '@modules/core/config/config.module';
import { ConfigSpyFactories } from '@modules/core/config/testing/config-spy-factories.spec';
import { ConfigServiceStub } from '@modules/core/config/testing/config.service.stub';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { ErrorHandlingSpyFactories } from '@modules/core/error-handling/testing/error-handling-spy-factories.spec';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let errorHandlingServiceSpy: jasmine.SpyObj<ErrorHandlingService>;
  let configServiceStub: ConfigServiceStub;

  beforeEach(async(() => {
    errorHandlingServiceSpy = ErrorHandlingSpyFactories.CreateErrorHandlingServiceSpy();
    configServiceStub = new ConfigServiceStub();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        NgLoadingIndicatorModule,
        ModalManagerModule,
        ToastModule
      ],
      declarations: [
        AppComponent,
        ErrorWindowComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceStub },
        { provide: ErrorHandlingService, useValue: errorHandlingServiceSpy },
        { provide: MessageService, useValue: NotificationsSpyFactories.CreateMessageServiceSpy() }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
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
});
