import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule, MatTooltipModule, MatIconModule, MatButtonModule,
  MatSidenavModule, MatMenuModule, MatFormFieldModule } from '@angular/material';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { ErrorWindowComponent, ErrorHandlingService } from '@modules/error-handling/error-handling.module';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigService } from '@modules/config/config.module';
import { ConfigSpyFactories } from '@modules/config/testing/config-spy-factories.spec';
import { SpyFactories } from './testing/spy-factories.spec';
import { ErrorHandlingSpyFactories } from '@modules/error-handling/testing/error-handling-spy-factories.spec';
import { PlayerService, StationLookupService, CoreRadioLogicModule } from '@modules/core-radio-logic/core-radio-logic.module';
import { CoreRadioLogicSpyFactories } from '@modules/core-radio-logic/testing/core-radio-logic-spy-factories.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { KeepAwakeService } from './services/keep-awake.service';
import { MessageService } from 'primeng/api';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from './components/custom-station-window/custom-station-window.component';
import { FormsModule } from '@angular/forms';

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
        CoreRadioLogicModule
      ],
      declarations: [
        AppComponent,
        SidenavComponent,
        ResponsiveSidenavComponent,
        PlayerBarComponent,
        PlayerBarStationInfoComponent,
        ErrorWindowComponent,
        SleepTimerMenuComponent,
        CustomStationWindowComponent
      ],
      providers: [
        { provide: ConfigService, useValue: ConfigSpyFactories.CreateConfigServiceSpy() },
        { provide: ErrorHandlingService, useValue: ErrorHandlingSpyFactories.CreateErrorHandlingServiceSpy() },
        { provide: PlayerService, useValue: CoreRadioLogicSpyFactories.CreatePlayerServiceSpy() },
        { provide: StationLookupService, useValue: CoreRadioLogicSpyFactories.CreateStationLookupServiceSpy() },
        { provide: KeepAwakeService, useValue: SpyFactories.CreateKeepAwakeServiceSpy() },
        { provide: MessageService, useValue: SpyFactories.CreateMessageServiceSpy() }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
