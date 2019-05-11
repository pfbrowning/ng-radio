import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioAppComponent } from './components/radio-app/radio-app.component';

const routes: Routes = [
  { path: '', component: RadioAppComponent,
    children: [
      { path: 'suggested-stations', loadChildren: '../suggested-stations/suggested-stations.module#SuggestedStationsModule' },
      { path: 'now-playing', loadChildren: '../now-playing/now-playing.module#NowPlayingModule' },
      { path: 'custom-station', loadChildren: '../custom-station/custom-station.module#CustomStationModule' },
      { path: 'radio-browser', loadChildren: '../radio-browser/radio-browser.module#RadioBrowserModule' },
      { path: 'favorites', loadChildren: '../favorites/favorites.module#FavoritesModule' },
      { path: '', redirectTo: 'suggested-stations', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RadioAppRoutingModule { }
