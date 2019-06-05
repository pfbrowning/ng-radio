import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioAppComponent } from './components/radio-app/radio-app.component';

const routes: Routes = [
  { path: '', component: RadioAppComponent,
    children: [
      { path: 'suggested-stations', loadChildren: () => import('../suggested-stations/suggested-stations.module').then(m => m.SuggestedStationsModule) },
      { path: 'now-playing', loadChildren: () => import('../now-playing/now-playing.module').then(m => m.NowPlayingModule) },
      { path: 'custom-station', loadChildren: () => import('../custom-station/custom-station.module').then(m => m.CustomStationModule) },
      { path: 'radio-browser', loadChildren: () => import('../radio-browser/radio-browser.module').then(m => m.RadioBrowserModule) },
      { path: 'favorites', loadChildren: () => import('../favorites/favorites.module').then(m => m.FavoritesModule) },
      { path: '', redirectTo: 'suggested-stations', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RadioAppRoutingModule { }
