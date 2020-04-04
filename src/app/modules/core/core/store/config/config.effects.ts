import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { configFetchStart, configFetchSucceeded, configFetchFailed } from './config.actions';
import { ConfigService } from '../../services/config.service';
import { of } from 'rxjs';
import { Action } from '@ngrx/store';
import { effectsInit } from './config.actions';
import { NotificationService } from '../../services/notification.service';
import { Severities } from '../../models/notifications/severities';


@Injectable()
export class ConfigEffects implements OnInitEffects {
  fetchConfig$ = createEffect(() => this.actions$.pipe(
      ofType(configFetchStart),
      switchMap(() => this.configService.fetch().pipe(
        map(config => configFetchSucceeded({config})),
        catchError(error => of(configFetchFailed({error}))
      ))
    )
  ));

  fetchConfigOnInit$ = createEffect(() => this.actions$.pipe(
    ofType(effectsInit),
    map(() => configFetchStart())
  ));

  notifyConfigFetchFailed$ = createEffect(() => this.actions$.pipe(
    ofType(configFetchFailed),
    tap(() => this.notificationService.notify(Severities.Error, 'Failed To Load Config'))
  ), { dispatch: false });

  ngrxOnInitEffects(): Action {
    return effectsInit();
  }

  constructor(
    private actions$: Actions,
    private configService: ConfigService,
    private notificationService: NotificationService
  ) {}
}
