import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomStationComponent } from './components/custom-station/custom-station.component';

const routes: Routes = [
  {
    path: '',
    component: CustomStationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomStationRoutingModule { }
