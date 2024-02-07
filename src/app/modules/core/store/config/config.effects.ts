import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { ConfigActions, FavoriteStationsActions } from './actions';
import { RouteResolverActions } from './actions';
import * as PlayerBarActions from '../dispatch-facades/player-bar/player-bar.actions';
import { switchMap, catchError, map, withLatestFrom, filter, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { selectStation } from '../player/player-actions';
import { ConfigService, FavoriteStationsService, NotificationsService } from '@core/services';
import { PlayerFacadeService } from '../player/player-facade.service';
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
