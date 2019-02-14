import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatTableModule } from '@angular/material/table'; 
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatIconModule } from '@angular/material/icon';
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
    ErrorWindowComponent
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
    ModalManagerModule
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initializeConfig, deps: [ConfigService], multi: true },
    { provide: ErrorHandler, useClass: UnhandledErrorCatcher },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
