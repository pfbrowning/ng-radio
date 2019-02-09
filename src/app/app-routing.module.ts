import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StationsComponent } from './components/stations/stations.component';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';

const routes: Routes = [
  { path: 'stations', component: StationsComponent },
  { path: 'now-playing', component: NowPlayingComponent },
  { path: '', redirectTo: 'stations', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
