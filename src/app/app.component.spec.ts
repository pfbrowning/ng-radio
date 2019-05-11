import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatTooltipModule, MatIconModule, MatButtonModule,
  MatSidenavModule, MatMenuModule, MatFormFieldModule } from '@angular/material';
import { ResponsiveSidenavComponent } from '../modules/core/responsive-sidenav/components/responsive-sidenav/responsive-sidenav.component';
import { ErrorWindowComponent, ErrorHandlingService } from '@modules/core/error-handling/error-handling.module';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigService } from '@modules/core/config/config.module';
import { ConfigSpyFactories } from '@modules/core/config/testing/config-spy-factories.spec';
import { NotificationsSpyFactories } from '@modules/core/notifications/testing/notifications-spy-factories.spec';
import { ErrorHandlingSpyFactories } from '@modules/core/error-handling/testing/error-handling-spy-factories.spec';
import { PlayerService, StationLookupService, CoreRadioLogicModule } from '@modules/core/core-radio-logic/core-radio-logic.module';
import { CoreRadioLogicSpyFactories } from '@modules/core/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { KeepAwakeService } from '@modules/core/keep-awake/keep-awake.module';
import { KeepAwakeSpyFactories } from '../modules/core/keep-awake/testing/keep-awake-spy-factories.spec';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';
import { PlayerBarComponent, PlayerBarStationInfoComponent, SidenavComponent } from '@modules/lazy/radio-app/radio-app.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule,
        MatFormFieldModule,
        MatTooltipModule,
        NgLoadingIndicatorModule,
        ModalManagerModule,
        ToastModule,
        NoopAnimationsModule,
        CoreRadioLogicModule,
        SharedComponentsModule
      ],
      declarations: [
        AppComponent,
        SidenavComponent,
        ResponsiveSidenavComponent,
        PlayerBarComponent,
        PlayerBarStationInfoComponent,
        ErrorWindowComponent
      ],
      providers: [
        { provide: ConfigService, useValue: ConfigSpyFactories.CreateConfigServiceSpy() },
        { provide: ErrorHandlingService, useValue: ErrorHandlingSpyFactories.CreateErrorHandlingServiceSpy() },
        { provide: PlayerService, useValue: CoreRadioLogicSpyFactories.CreatePlayerServiceSpy() },
        { provide: StationLookupService, useValue: CoreRadioLogicSpyFactories.CreateStationLookupServiceSpy() },
        { provide: KeepAwakeService, useValue: KeepAwakeSpyFactories.CreateKeepAwakeServiceSpy() },
        { provide: MessageService, useValue: NotificationsSpyFactories.CreateMessageServiceSpy() }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
