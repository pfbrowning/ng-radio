import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { OAuthModule } from 'angular-oauth2-oidc';
import { OauthEventListenerService } from './services/oauth-event-listener.service';
import { StoreModule } from '@ngrx/store';
import { authenticationReducer } from './store/authentication.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthenticationEffects } from './store/authentication.effects';

@NgModule({
  imports: [
    CommonModule,
    OAuthModule.forRoot(),
    StoreModule.forFeature('authentication', authenticationReducer),
    EffectsModule.forFeature([AuthenticationEffects])
  ],
  providers: [
    OauthEventListenerService,
    AuthGuard
  ]
})
export class AuthenticationModule { }
