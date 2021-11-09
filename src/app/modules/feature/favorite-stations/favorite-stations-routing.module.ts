import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteStationsResolver } from './resolvers/favorite-stations.resolver';
import { FavoriteStationsComponent } from './components/favorite-stations/favorite-stations.component';

const routes: Routes = [
  {
    path: '',
    component: FavoriteStationsComponent,
    resolve: { favoriteStations: FavoriteStationsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteStationsRoutingModule {}
