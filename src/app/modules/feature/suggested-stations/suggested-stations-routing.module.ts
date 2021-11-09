import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuggestedStationsComponent } from './components/suggested-stations/suggested-stations.component';
import { SuggestedStationsResolver } from './resolvers/suggested-stations.resolver';

const routes: Routes = [
  {
    path: '',
    component: SuggestedStationsComponent,
    resolve: { suggestedStations: SuggestedStationsResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [SuggestedStationsResolver],
})
export class SuggestedStationsRoutingModule {}
