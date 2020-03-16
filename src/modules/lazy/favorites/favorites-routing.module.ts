import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { FavoriteStationsResolver } from './resolvers/favorite-stations.resolver';

const routes: Routes = [
  {
    path: '',
    component: FavoritesComponent,
    resolve: { favoriteStations: FavoriteStationsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FavoritesRoutingModule { }
