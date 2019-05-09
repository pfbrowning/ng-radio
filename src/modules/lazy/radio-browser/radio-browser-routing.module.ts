import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';

const routes: Routes = [
  {
    path: '',
    component: RadioBrowserComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadioBrowserRoutingModule { }
