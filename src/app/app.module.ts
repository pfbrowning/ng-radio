import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler, InjectionToken } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatTableModule, MatSidenavModule, MatIconModule,
  MatFormFieldModule, MatInputModule, MatMenuModule, MatTooltipModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { StationsComponent } from './components/stations/stations.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { ErrorWindowComponent } from './components/error-window/error-window.component';
import { UnhandledErrorCatcher } from './services/unhandled-error-catcher';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { AudioElementToken } from './injection-tokens/audio-element-token';
import { AudioElement } from './models/audio-element';
import { ApplicationInsightsModule, AppInsightsService } from '@markpieszak/ng-application-insights';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from './components/custom-station-window/custom-station-window.component';
import * as NoSleep from 'nosleep.js';

export function initializeConfig(configService: ConfigService) {
    return () => configService.initialize();
}

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    StationsComponent,
    PlayerBarComponent,
    RadioBrowserComponent,
    FavoritesComponent,
    ErrorWindowComponent,
    ResponsiveSidenavComponent,
    SidenavComponent,
    SleepTimerMenuComponent,
    PlayerBarStationInfoComponent,
    CustomStationWindowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ToastModule,
    ModalManagerModule,
    NgLoadingIndicatorModule,
    ApplicationInsightsModule.forRoot({
      instrumentationKeySetLater: true
    })
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [ConfigService], multi: true },
    { provide: ErrorHandler, useClass: UnhandledErrorCatcher },
    { provide: NoSleepToken, useValue: new NoSleep() },
    { provide: AudioElementToken, useValue: new AudioElement() },
    MessageService,
    AppInsightsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
