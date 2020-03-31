import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core';

const routes: Routes = [
  {
    path: 'suggested-stations',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../app/modules/feature/suggested-stations/suggested-stations.module').then(m => m.SuggestedStationsModule)
  },
  {
    path: 'now-playing',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../app/modules/feature/now-playing/now-playing.module').then(m => m.NowPlayingModule)
  },
  {
    path: 'custom-station',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../app/modules/feature/custom-station/custom-station.module').then(m => m.CustomStationModule)
  },
  {
    path: 'radio-browser',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../app/modules/feature/radio-browser/radio-browser.module').then(m => m.RadioBrowserModule)
  },
  {
    path: 'favorites',
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../app/modules/feature/favorite-stations/favorite-stations.module').then(m => m.FavoriteStationsModule)
  },
  {
    path: '',
    redirectTo: 'suggested-stations',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'suggested-stations'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
