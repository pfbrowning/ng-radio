import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@authentication';

const routes: Routes = [
  {
    path: 'app',
    // Check to ensure that the user is authenticated before loading the radio app module
    canActivate: [ AuthGuard ],
    loadChildren: () => import('../modules/lazy/radio-app/radio-app.module').then(m => m.RadioAppModule)
  },
  { path: '', redirectTo: 'app', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
