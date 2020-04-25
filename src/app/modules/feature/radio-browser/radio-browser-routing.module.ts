import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadioBrowserComponent } from './components/radio-browser/radio-browser.component';
import { RadioBrowserResolver } from './resolvers/radio-browser.resolver';

const routes: Routes = [
  {
    path: '',
    component: RadioBrowserComponent,
    resolve: { radioBrowser: RadioBrowserResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadioBrowserRoutingModule { }
