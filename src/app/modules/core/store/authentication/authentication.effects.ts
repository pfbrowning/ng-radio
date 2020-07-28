import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { switchMap, catchError, map, filter, tap, takeUntil, mapTo, withLatestFrom } from 'rxjs/operators';
import { of, from, timer } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from '../../services/config.service';
import { CurrentTimeService } from '../../services/current-time.service';
import { NotificationService } from '../../services/notification.service';
import { Severities } from '../../models/notifications/severities';
import { Action, Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { LoggingService } from '../../services/logging.service';
import { AuthenticationActions, AuthenticationSelectors } from '.';

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
    ofType(AuthenticationActions.effectsInit),
    switchMap(() => this.configService.appConfig$),
    map(() => AuthenticationActions.initializeStart())
  ));

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeStart),
    tap(() => this.oauthService.configure(this.configService.appConfig.authConfig)),
    switchMap(() => from(this.oauthService.loadDiscoveryDocumentAndTryLogin()).pipe(
      tap(() => this.oauthService.setupAutomaticSilentRefresh()),
      map(() => AuthenticationActions.initializeSucceeded({
        idClaims: this.oauthService.getIdentityClaims(),
        idTokenExpiration: this.oauthService.getIdTokenExpiration(),
        accessTokenExpiration: this.oauthService.getAccessTokenExpiration(),
        authenticated: this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken()
      })),
      catchError(error => of(AuthenticationActions.initializeFailed({error})))
    ))
  ));

  silentRefreshFailed$ = createEffect(() => this.oauthService.events.pipe(
    filter(event => ['silent_refresh_timeout', 'silent_refresh_error'].includes(event.type)),
    map(event => AuthenticationActions.silentRefreshFailed({error: event}))
  ));

  silentRefreshSucceeded$ = createEffect(() => this.oauthService.events.pipe(
    filter(event => event.type === 'silently_refreshed'),
    map(() => AuthenticationActions.silentRefreshSucceeded({
      idTokenExpiration: this.oauthService.getIdTokenExpiration(),
      accessTokenExpiration: this.oauthService.getAccessTokenExpiration()
    }))
  ));

  idTokenExpiration$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeSucceeded, AuthenticationActions.silentRefreshSucceeded),
    filter(action => action.idTokenExpiration != null),
    map(action => action.idTokenExpiration - this.currentTimeService.unix()),
    switchMap(timeToExpiration => timer(timeToExpiration).pipe(
      takeUntil(this.actions$.pipe(ofType(AuthenticationActions.silentRefreshSucceeded))),
      mapTo(AuthenticationActions.idTokenExpired())
    ))
  ));

  accessTokenExpiration$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeSucceeded, AuthenticationActions.silentRefreshSucceeded),
    filter(action => action.accessTokenExpiration != null),
    map(action => action.accessTokenExpiration - this.currentTimeService.unix()),
    switchMap(timeToExpiration => timer(timeToExpiration).pipe(
      takeUntil(this.actions$.pipe(ofType(AuthenticationActions.silentRefreshSucceeded))),
      mapTo(AuthenticationActions.accessTokenExpired())
    ))
  ));

  notifyTokenExpired$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.idTokenExpired, AuthenticationActions.accessTokenExpired),
    tap(() => this.notificationService.notify(Severities.Error, 'Tokens Expired', 'Tokens expired.  This should not happen regularly.'))
  ), { dispatch: false });

  logUserInit$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeSucceeded),
    withLatestFrom(this.store.pipe(select(AuthenticationSelectors.currentUserEmail))),
    filter(([{ authenticated } , email ]) => authenticated && email != null),
    tap(([, email ]) => {
      this.loggingService.setAuthenticatedUserContext(email);
      this.loggingService.logInformation('userInitialized', { 'email': email });
    })
  ), { dispatch: false });

  logInitializeFailed$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeFailed),
    tap(action => this.loggingService.logCritical(action.error, {
      'event': 'Failed To Initialize Authentication',
      'details': action.error
    }))
  ), { dispatch: false });

  logSilentRefreshFailed$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.silentRefreshFailed),
    withLatestFrom(this.store.pipe(select(AuthenticationSelectors.currentUserEmail))),
    tap(([action, email]) => this.loggingService.logError(action.error, {
      event: 'Silent Refresh Failed',
      details: action.error,
      email
    }))
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return AuthenticationActions.effectsInit();
  }
}
