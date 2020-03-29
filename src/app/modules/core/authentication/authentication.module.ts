import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OauthEventListenerService } from './services/oauth-event-listener.service';

@NgModule({
  imports: [
    CommonModule,
    OAuthModule.forRoot()
  ],
  providers: [
    OauthEventListenerService,
    AuthGuard
  ]
})
export class AuthenticationModule { }
