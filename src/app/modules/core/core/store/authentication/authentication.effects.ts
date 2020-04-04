import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { switchMap, catchError, map, filter, tap, takeUntil, mapTo, take, withLatestFrom } from 'rxjs/operators';
import { of, from, timer } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from '@config';
import { CurrentTimeService } from '../../services/current-time.service';
import { NotificationService, Severities } from '@notifications';
import { Action, Store, select } from '@ngrx/store';
import {
  effectsInit,
  initializeStart,
  initializeSucceeded,
  initializeFailed,
  silentRefreshSucceeded,
  idTokenExpired,
  accessTokenExpired,
  silentRefreshFailed
} from './authentication.actions';
import { RootState } from '../../models/root-state';
import { selectConfig } from '@config';
import { LoggingService } from '@logging';
import { selectEmail } from './authentication.selectors';
import dayjs from 'dayjs';

@Injectable()
export class AuthenticationEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private oauthService: OAuthService,
    private configService: ConfigService,
    private currentTimeService: CurrentTimeService,
    private notificationService: NotificationService,
    private loggingService: LoggingService
  ) { }

  initAuthOnConfigLoad$ = createEffect(() => this.actions$.pipe(
    ofType(effectsInit),
    switchMap(() => this.store.pipe(
      select(selectConfig),
      filter(config => config != null),
      take(1),
      map(() => initializeStart())
    ))
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
        authenticated: this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken(),
        email: this.oauthService.getIdentityClaims()['email']
      })),
      tap(action => {
        console.log('id token claims', this.oauthService.getIdentityClaims());
        console.log('id token expiration', dayjs(action.idTokenExpiration).format('h:mm:ssa'));
        console.log('access token expiration', dayjs(action.accessTokenExpiration).format('h:mm:ssa'));
      }),
      catchError(error => of(initializeFailed({error})))
    ))
  ));

  silentRefreshFailed$ = createEffect(() => this.oauthService.events.pipe(
    filter(event => ['silent_refresh_timeout', 'silent_refresh_error'].includes(event.type)),
    map(event => silentRefreshFailed({error: event}))
  ));

  silentRefreshSucceeded$ = createEffect(() => this.oauthService.events.pipe(
    filter(event => event.type === 'silently_refreshed'),
    map(() => silentRefreshSucceeded({
      idToken: this.oauthService.getIdToken(),
      accessToken: this.oauthService.getAccessToken(),
      idTokenExpiration: this.oauthService.getIdTokenExpiration(),
      accessTokenExpiration: this.oauthService.getAccessTokenExpiration()
    }))
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

  logUserInit$ = createEffect(() => this.actions$.pipe(
    ofType(initializeSucceeded),
    filter(action => action.authenticated && action.email != null),
    tap(action => {
      this.loggingService.setAuthenticatedUserContext(action.email, this.oauthService.getIdentityClaims()['sub']);
      this.loggingService.logInformation('userInitialized', { 'email': action.email });
    })
  ), { dispatch: false });

  logInitializeFailed$ = createEffect(() => this.actions$.pipe(
    ofType(initializeFailed),
    tap(action => this.loggingService.logCritical(action.error, {
      'event': 'Failed To Initialize Authentication',
      'details': action.error
    }))
  ), { dispatch: false });

  logSilentRefreshFailed$ = createEffect(() => this.actions$.pipe(
    ofType(silentRefreshFailed),
    withLatestFrom(this.store.pipe(select(selectEmail))),
    tap(([action, email]) => this.loggingService.logError(action.error, {
      event: 'Silent Refresh Failed',
      details: action.error,
      email
    }))
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return effectsInit();
  }
}
