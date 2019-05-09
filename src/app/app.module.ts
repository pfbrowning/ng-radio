import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule, MatButtonModule, MatTableModule, MatSidenavModule,
  MatIconModule,MatFormFieldModule, MatInputModule, MatMenuModule, MatTooltipModule, 
  MatProgressSpinnerModule, MatCardModule } from '@angular/material';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from './app.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalManagerModule } from '@browninglogic/ng-modal';
import { NgLoadingIndicatorModule } from '@browninglogic/ng-loading-indicator';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SleepTimerMenuComponent } from './components/sleep-timer-menu/sleep-timer-menu.component';
import { CoreRadioLogicModule } from '@modules/core-radio-logic/core-radio-logic.module';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { CustomStationWindowComponent } from './components/custom-station-window/custom-station-window.component';
import { ConfigModule } from '@modules/config/config.module';
import { ErrorHandlingModule } from '@modules/error-handling/error-handling.module';
import { LoggingModule } from '@modules/core/logging/logging.module';
import { KeepAwakeModule } from '@modules/core/keep-awake/keep-awake.module';
import { NotificationsModule } from '@modules/core/notifications/notifications.module';

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    PlayerBarComponent,
    RadioBrowserComponent,
    FavoritesComponent,
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
    ErrorHandlingModule,
    LoggingModule,
    KeepAwakeModule,
    NotificationsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
