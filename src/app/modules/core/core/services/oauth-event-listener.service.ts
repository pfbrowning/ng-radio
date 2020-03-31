import { Injectable } from '@angular/core';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Store } from '@ngrx/store';
import { RootState } from '@core';
import { silentRefreshFailed, silentRefreshSucceeded } from '../store/authentication/authentication.actions';

@Injectable()
export class OauthEventListenerService {
  constructor(private oauthService: OAuthService, private store: Store<RootState>) {
    this.oauthService.events.subscribe(event => this.onOauthEvent(event));
  }

  private onOauthEvent(oAuthEvent: OAuthEvent) {
    switch (oAuthEvent.type) {
      // When the silent refresh fails
      case 'silent_refresh_timeout':
      case 'silent_refresh_error':
        this.store.dispatch(silentRefreshFailed({error: oAuthEvent}));
        break;
      case 'silently_refreshed':
        this.store.dispatch(silentRefreshSucceeded({
          idToken: this.oauthService.getIdToken(),
          accessToken: this.oauthService.getAccessToken(),
          idTokenExpiration: this.oauthService.getIdTokenExpiration(),
          accessTokenExpiration: this.oauthService.getAccessTokenExpiration()
        }));
        break;
    }

  }
}
