import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    SleepTimerMenuComponent
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
    ToastModule,
    ModalManagerModule,
    NgLoadingIndicatorModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [ConfigService], multi: true },
    { provide: ErrorHandler, useClass: UnhandledErrorCatcher },
    { provide: NoSleep, useValue: new NoSleep() },
    { provide: HTMLAudioElement, useValue: new Audio() },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
