import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, catchError, map, filter, tap, takeUntil, mapTo } from 'rxjs/operators';
import { of, from, timer } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from '@config';
import { CurrentTimeService } from '@core';
import {
  initializeStart,
  initializeSucceeded,
  initializeFailed,
  silentRefreshSucceeded,
  idTokenExpired,
  accessTokenExpired
} from '@root-state/authentication';
import { appInit } from '../../root-state/root.actions';
import { NotificationService, Severities } from '@notifications';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthenticationEffects {
  constructor(
    private actions$: Actions,
    private oauthService: OAuthService,
    private configService: ConfigService,
    private currentTimeService: CurrentTimeService,
    private notificationService: NotificationService,
  ) {}

  initAuthOnAppInit$ = createEffect(() => this.actions$.pipe(
    ofType(appInit),
    map(() => initializeStart())
  ));

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(initializeStart),
    tap(() => this.oauthService.configure(this.configService.appConfig.authConfig)),
    switchMap(() => from(this.oauthService.loadDiscoveryDocumentAndTryLogin()).pipe(
      tap(() => this.oauthService.setupAutomaticSilentRefresh()),
      map(() => initializeSucceeded({
        idToken: this.oauthService.getIdToken(),
        accessToken: this.oauthService.getAccessToken(),
        idTokenExpiration: this.oauthService.getIdTokenExpiration(),
        accessTokenExpiration: this.oauthService.getAccessTokenExpiration(),
        authenticated: this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()
      })),
      tap(action => {
        console.log('id token expiration', dayjs(action.idTokenExpiration).format('h:mm:ssa'));
        console.log('access token expiration', dayjs(action.accessTokenExpiration).format('h:mm:ssa'));
      }),
      catchError(error => of(initializeFailed({error})))
    ))
  ));

  idTokenExpiration$ = createEffect(() => this.actions$.pipe(
    ofType(initializeSucceeded, silentRefreshSucceeded),
    filter(action => action.idTokenExpiration != null),
    map(action => action.idTokenExpiration - this.currentTimeService.unix()),
    switchMap(timeToExpiration => timer(timeToExpiration).pipe(
      takeUntil(this.actions$.pipe(ofType(silentRefreshSucceeded))),
      mapTo(idTokenExpired())
    ))
  ));

  accessTokenExpiration$ = createEffect(() => this.actions$.pipe(
    ofType(initializeSucceeded, silentRefreshSucceeded),
    filter(action => action.accessTokenExpiration != null),
    map(action => action.accessTokenExpiration - this.currentTimeService.unix()),
    switchMap(timeToExpiration => timer(timeToExpiration).pipe(
      takeUntil(this.actions$.pipe(ofType(silentRefreshSucceeded))),
      mapTo(accessTokenExpired())
    ))
  ));

  notifyTokenExpired$ = createEffect(() => this.actions$.pipe(
    ofType(idTokenExpired, accessTokenExpired),
    tap(() => this.notificationService.notify(Severities.Error, 'Tokens Expired', 'Tokens expired.  This should not happen regularly.'))
  ), { dispatch: false });
}
