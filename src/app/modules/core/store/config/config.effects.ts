import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ConfigActions } from './actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigService } from '@core/services';
import { Action } from '@ngrx/store';

@Injectable()
export class ConfigEffects implements OnInitEffects {
  constructor(private actions$: Actions, private configService: ConfigService) {}

  ngrxOnInitEffects(): Action {
    return ConfigActions.effectsInit();
  }

  startConfigFetch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.effectsInit),
      map(() => ConfigActions.fetchConfigStart())
    )
  );

  fetchConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ConfigActions.fetchConfigStart),
      switchMap(() =>
        this.configService.fetch().pipe(
          map(ConfigActions.fetchConfigSucceeded),
          catchError(error =>
            of(
              ConfigActions.fetchConfigFailed({
                error,
              })
            )
          )
        )
      )
    )
  );
}
