import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './components/favorites/favorites.component';

const routes: Routes = [
  { path: 'suggested-stations', loadChildren: '../modules/lazy/suggested-stations/suggested-stations.module#SuggestedStationsModule' },
  { path: 'now-playing', loadChildren: '../modules/lazy/now-playing/now-playing.module#NowPlayingModule' },
  { path: 'custom-station', loadChildren: '../modules/lazy/custom-station/custom-station.module#CustomStationModule' },
  { path: 'radio-browser', loadChildren: '../modules/lazy/radio-browser/radio-browser.module#RadioBrowserModule' },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', redirectTo: 'suggested-stations', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
