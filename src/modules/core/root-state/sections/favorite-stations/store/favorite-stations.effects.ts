import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchStationsStart, fetchStationsSucceeded, fetchStationsFailed } from './favorite-stations.actions';
import { switchMap, catchError, map, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavoriteStationsService } from '@core-radio-logic';
import { selectStation } from '../../player/store/player-actions';
import { Store, select } from '@ngrx/store';
import { selectFavoriteStationsLoadingStatus } from './favorite-stations.selectors';
import { RootState } from '@root-state';

@Injectable()
export class FavoriteStationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private favoriteStationsService: FavoriteStationsService
  ) {}

  fetchStations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStationsStart),
    switchMap(() =>
      this.favoriteStationsService.fetchAll().pipe(
        map(stations => fetchStationsSucceeded({stations})),
        catchError(error => of(fetchStationsFailed({error})))
      )
    )
  ));

  fetchOnInitialStationSelect$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    withLatestFrom(this.store.pipe(select(selectFavoriteStationsLoadingStatus))),
    filter(([action, selected]) => !selected.loaded && !selected.inProgress),
    map(() => fetchStationsStart())
  ));
}
