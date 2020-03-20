import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  fetchStationsStart,
  fetchStationsSucceeded,
  fetchStationsFailed,
  addToFavoritesStart,
  addToFavoritesSucceeded,
  removeFromFavoritesStart,
  addToFavoritesFailed,
  removeFromFavoritesSucceeded,
  removeFromFavoritesFailed,
  addCurrentStationToFavoritesRequested, 
  removeCurrentStationFromFavoritesRequested
} from './favorite-stations.actions';
import { switchMap, catchError, map, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavoriteStationsService } from '@core-radio-logic';
import { selectStation } from '../../player/store/player-actions';
import { Store, select } from '@ngrx/store';
import { selectFavoriteStationsLoadingStatus } from './favorite-stations.selectors';
import { RootState } from '@root-state';
import { selectIsCurrentStationInFavorites, selectCurrentStation, selectCurrentFavoriteStationId } from '../../player/store/player.selectors';

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

  addCurrentStationToFavoritesRequested$ = createEffect(() => this.actions$.pipe(
    ofType(addCurrentStationToFavoritesRequested),
    withLatestFrom(this.store.pipe(select(selectIsCurrentStationInFavorites))),
    filter(([action, isFavorite]) => !isFavorite),
    withLatestFrom(this.store.pipe(select(selectCurrentStation))),
    map(([action, station]) => addToFavoritesStart({station}))
  ));

  addFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(addToFavoritesStart),
    mergeMap(action =>
      this.favoriteStationsService.addFavorite(action.station).pipe(
        map(station => addToFavoritesSucceeded({station})),
        catchError(error => of(addToFavoritesFailed({station: action.station, error})))
      )
    )
  ));

  removeCurrentStationFromFavoritesRequested$ = createEffect(() => this.actions$.pipe(
    ofType(removeCurrentStationFromFavoritesRequested),
    withLatestFrom(this.store.pipe(select(selectIsCurrentStationInFavorites))),
    filter(([action, isFavorite]) => isFavorite),
    withLatestFrom(this.store.pipe(select(selectCurrentFavoriteStationId))),
    map(([action, stationId]) => removeFromFavoritesStart({stationId}))
  ));

  removeFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(removeFromFavoritesStart),
    mergeMap(action =>
      this.favoriteStationsService.removeFavorite(action.stationId).pipe(
        map(() => removeFromFavoritesSucceeded({stationId: action.stationId})),
        catchError(error => of(removeFromFavoritesFailed({stationId: action.stationId, error})))
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
