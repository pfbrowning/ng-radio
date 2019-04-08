import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { ErrorWindowComponent } from './components/error-window/error-window.component';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ToastModule } from 'primeng/toast';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { ConfigService } from './services/config.service';
import { SpyFactories } from './testing/spy-factories.spec';
import { ErrorHandlingService } from './services/error-handling.service';
import { PlayerService } from './services/player.service';
import { MetadataService } from './services/metadata.service';
import { RadioBrowserService } from './services/radio-browser.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { NoSleepService } from './services/no-sleep.service';
import { MessageService } from 'primeng/api';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatMenuModule,
        NgLoadingIndicatorModule,
        ModalManagerModule,
        ToastModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent,
        SidenavComponent,
        ResponsiveSidenavComponent,
        PlayerBarComponent,
        PlayerBarStationInfoComponent,
        ErrorWindowComponent,
        SleepTimerMenuComponent
      ],
      providers: [
        { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() },
        { provide: ErrorHandlingService, useValue: SpyFactories.CreateErrorHandlingServiceSpy() },
        { provide: PlayerService, useValue: SpyFactories.CreatePlayerServiceSpy() },
        { provide: RadioBrowserService, useValue: SpyFactories.CreateRadioBrowserServiceSpy() },
        { provide: NoSleepService, useValue: SpyFactories.CreateNoSleepServiceSpy() },
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
