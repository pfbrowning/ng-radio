import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OAuthModule.forRoot()
  ],
  providers: [
    AuthenticationService,
    AuthGuard
  ]
})
export class AuthenticationModule { }

export { AuthenticationService, AuthGuard };
