import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@core/services';

const routes: Routes = [
  {
    path: 'suggested-stations',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('../app/modules/feature/suggested-stations/suggested-stations.module').then(
        m => m.SuggestedStationsModule
      ),
  },
  {
    path: 'now-playing',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('../app/modules/feature/now-playing/now-playing.module').then(m => m.NowPlayingModule),
  },
  {
    path: 'radio-browser',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('../app/modules/feature/radio-browser/radio-browser.module').then(
        m => m.RadioBrowserModule
      ),
  },
  {
    path: 'favorites',
    canActivate: [AuthGuardService],
    loadChildren: () =>
      import('../app/modules/feature/favorite-stations/favorite-stations.module').then(
        m => m.FavoriteStationsModule
      ),
  },
  {
    path: '',
    redirectTo: 'suggested-stations',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'suggested-stations',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
