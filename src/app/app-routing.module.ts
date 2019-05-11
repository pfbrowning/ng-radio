import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@modules/core/authentication/authentication.module';

const routes: Routes = [
  // Check to ensure that the user is authenticated before loading the radio app module
  { path: 'app', canActivate: [ AuthGuard ], loadChildren: '../modules/lazy/radio-app/radio-app.module#RadioAppModule' },
  { path: '', redirectTo: 'app', pathMatch: 'full'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
