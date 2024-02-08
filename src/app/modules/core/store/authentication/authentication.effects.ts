import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import {
  switchMap,
  catchError,
  map,
  filter,
  tap,
  withLatestFrom,
  exhaustMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { AppInsightsService } from '../../services/logging/app-insights.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { AuthenticationFacadeService } from './authentication-facade.service';
import { LoggingService, NotificationsService } from '@core/services';
import { AuthenticationActions } from './actions';
import { ConfigProviderService } from '../../services/config/config-provider.service';

@Injectable()
export class AuthenticationEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private configProvider: ConfigProviderService,
    private authenticationFacade: AuthenticationFacadeService,
    private authenticationService: AuthenticationService,
    private notificationsService: NotificationsService,
    private loggingService: LoggingService,
    private appInsightsService: AppInsightsService
  ) {}

  initAuthOnConfigLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.effectsInit),
      switchMap(() => this.configProvider.getConfigOnceLoaded()),
      map(() => AuthenticationActions.initializeStart())
    )
  );

  initialize$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.initializeStart),
      switchMap(() => this.configProvider.getConfigOnceLoaded()),
      switchMap(config =>
        this.authenticationService.initialize(config.authConfig.userManager).pipe(
          map(result =>
            AuthenticationActions.initializeSucceeded({
              ...result,
            })
          ),
          catchError(error =>
            of(
              AuthenticationActions.initializeFailed({
                error,
              })
            )
          )
        )
      )
    )
  );

  initSilentRefreshOnTokenExpiring$ = createEffect(() =>
    this.authenticationService.accessTokenExpiring$.pipe(
      map(() => AuthenticationActions.silentRefreshStart())
    )
  );

  silentRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthenticationActions.silentRefreshStart),
      exhaustMap(() =>
        this.authenticationService.attemptSilentRefresh().pipe(
          map(result =>
            AuthenticationActions.silentRefreshSucceeded({
              ...result,
            })
          ),
          catchError(error => of(AuthenticationActions.silentRefreshFailed({ error })))
        )
      )
    )
  );

  accessTokenExpired$ = createEffect(() =>
    this.authenticationService.accessTokenExpired$.pipe(
      map(() => AuthenticationActions.accessTokenExpired())
    )
  );

  logoutButtonClicked$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.logoutButtonClicked),
        switchMap(() => this.configProvider.getConfigOnceLoaded()),
        tap(config => this.authenticationService.logOut(config.authConfig.logoutUrl))
      ),
    { dispatch: false }
  );

  notifyTokenExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.accessTokenExpired),
        tap(() =>
          this.notificationsService.error(
            'Tokens Expired',
            'Tokens expired.  Please log in again.',
            20000
          )
        )
      ),
    { dispatch: false }
  );

  logUserInit$ = createEffect(
    () =>
      this.authenticationFacade.email$.pipe(
        filter(email => email != null),
        tap(email => this.loggingService.info('User Logged In', { email }))
      ),
    { dispatch: false }
  );

  setAppInsightsUser$ = createEffect(
    () =>
      this.authenticationFacade.email$.pipe(
        tap(email => this.appInsightsService.setAuthenticatedUserContext(email))
      ),
    { dispatch: false }
  );

  logInitializeFailed$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthenticationActions.initializeFailed),
        tap(({ error }) =>
          this.loggingService.fatal('Failed To Initialize Authentication', { error })
        )
      ),
    { dispatch: false }
  );

  logSilentRefreshFailed$ = createEffect(
    () =>
      this.authenticationService.silentRefreshError$.pipe(
        withLatestFrom(this.authenticationFacade.email$),
        tap(([error, email]) =>
          this.loggingService.error('Silent Refresh Failed', {
            error,
            email,
          })
        )
      ),
    { dispatch: false }
  );

  ngrxOnInitEffects(): Action {
    return AuthenticationActions.effectsInit();
  }
}
