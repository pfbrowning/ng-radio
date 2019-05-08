import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatTableModule, MatSidenavModule, MatIconModule,
  MatFormFieldModule, MatInputModule, MatMenuModule, MatTooltipModule, MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorWindowComponent } from './components/error-window/error-window.component';
import { UnhandledErrorCatcher } from './services/unhandled-error-catcher';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { NoSleepToken } from './injection-tokens/no-sleep-token';
import { CoreRadioLogicModule } from '@modules/core-radio-logic/core-radio-logic.module';
import { ApplicationInsightsModule, AppInsightsService } from '@markpieszak/ng-application-insights';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from './components/custom-station-window/custom-station-window.component';
import { ConfigModule } from '@modules/config/config.module';
import * as NoSleep from 'nosleep.js';

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
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
    ConfigModule,
    CoreRadioLogicModule,
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
    { provide: ErrorHandler, useClass: UnhandledErrorCatcher },
    { provide: NoSleepToken, useValue: new NoSleep() },
    MessageService,
    AppInsightsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
