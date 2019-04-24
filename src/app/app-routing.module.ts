import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { SuggestedStationsComponent } from './components/suggested-stations/suggested-stations.component';
import { SuggestedStationsResolver } from './resolvers/suggested-stations.resolver';

const routes: Routes = [
  { path: 'suggested-stations', resolve: { suggestedStations: SuggestedStationsResolver }, component: SuggestedStationsComponent },
  { path: 'now-playing', component: NowPlayingComponent },
  { path: 'radio-browser', component: RadioBrowserComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', redirectTo: 'suggested-stations', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [ SuggestedStationsResolver ]
})
export class AppRoutingModule { }
