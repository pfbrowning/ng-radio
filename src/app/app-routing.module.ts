import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';

const routes: Routes = [
  { path: 'suggested-stations', loadChildren: '../modules/lazy/suggested-stations/suggested-stations.module#SuggestedStationsModule' },
  { path: 'now-playing', component: NowPlayingComponent },
  { path: 'radio-browser', component: RadioBrowserComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', redirectTo: 'suggested-stations', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
