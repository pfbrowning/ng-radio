import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { switchMap, catchError, map, filter, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '../../services/config.service';
import { NotificationService } from '../../services/notification.service';
import { Severities } from '../../models/notifications/severities';
import { Action } from '@ngrx/store';
import { LoggingService } from '../../services/logging.service';
import { AppInsightsService } from '../../services/logging/app-insights.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AuthenticationFacadeService } from './authentication-facade.service';
import * as AuthenticationActions from './authentication.actions';

@Injectable()
export class AuthenticationEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private configService: ConfigService,
    private authenticationFacade: AuthenticationFacadeService,
    private authenticationService: AuthenticationService,
    private notificationsService: NotificationService,
    private loggingService: LoggingService,
    private appInsightsService: AppInsightsService
  ) { }

  initAuthOnConfigLoad$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.effectsInit),
    switchMap(() => this.configService.appConfig$),
    map(() => AuthenticationActions.initializeStart())
  ));

  initialize$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeStart),
    switchMap(() => this.configService.appConfig$),
    switchMap(config => this.authenticationService.initialize(config.authConfig.userManager).pipe(
      map(result => AuthenticationActions.initializeSucceeded({ ...result })),
      catchError(error => of(AuthenticationActions.initializeFailed({error})))
    ))
  ));

  silentRefreshSucceeded$ = createEffect(() => this.authenticationService.silentRefreshSucceeded$.pipe(
    map(result => AuthenticationActions.silentRefreshSucceeded({ ...result }))
  ));

  accessTokenExpired$ = createEffect(() => this.authenticationService.accessTokenExpired$.pipe(
    map(() => AuthenticationActions.accessTokenExpired())
  ));

  logoutButtonClicked$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.logoutButtonClicked),
    switchMap(() => this.configService.appConfig$),
    tap(config => this.authenticationService.logOut(config.authConfig.logoutUrl))
  ), { dispatch: false });

  notifyTokenExpired$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.accessTokenExpired),
    tap(() => this.notificationsService.notify(Severities.Error, 'Tokens Expired', 'Tokens expired.  Please log in again.', 20000))
  ), { dispatch: false });

  logUserInit$ = createEffect(() => this.authenticationFacade.email$.pipe(
    filter(email => email != null),
    tap(email => this.loggingService.info('User Logged In', { 'email': email }))
  ), { dispatch: false });

  setAppInsightsUser$ = createEffect(() => this.authenticationFacade.email$.pipe(
    tap(email => this.appInsightsService.setAuthenticatedUserContext(email))
  ), { dispatch: false });

  logInitializeFailed$ = createEffect(() => this.actions$.pipe(
    ofType(AuthenticationActions.initializeFailed),
    tap(action => this.loggingService.fatal('Failed To Initialize Authentication', {
      'details': action.error
    }))
  ), { dispatch: false });

  logSilentRefreshFailed$ = createEffect(() => this.authenticationService.silentRefreshError$.pipe(
    withLatestFrom(this.authenticationFacade.email$),
    tap(([error, email]) => this.loggingService.error('Silent Refresh Failed', { error, email }))
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return AuthenticationActions.effectsInit();
  }
}
