import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [
    AppComponent,
    NowPlayingComponent,
    StationsComponent,
    PlayerBarComponent,
    RadioBrowserComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatSidenavModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
