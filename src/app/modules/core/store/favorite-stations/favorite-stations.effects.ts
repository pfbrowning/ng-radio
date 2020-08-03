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
  removeCurrentStationFromFavoritesRequested,
} from './favorite-stations.actions';
import { switchMap, catchError, map, withLatestFrom, filter, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { selectStation } from '../player/player-actions';
import { FavoriteStationsActions, FavoriteStationsSelectors } from '.';
import { FavoriteStationsService, NotificationsService } from '@core/services';

@Injectable()
export class FavoriteStationsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<RootState>,
    private favoriteStationsService: FavoriteStationsService,
    private notificationsService: NotificationsService
  ) {}

  fetchStationsSubmit$ = createEffect(() => this.actions$.pipe(
    ofType(FavoriteStationsActions.fetchStationsSubmit),
    withLatestFrom(this.store.pipe(select(FavoriteStationsSelectors.selectFavoriteStationsLoadingStatus))),
    filter(([, selected]) => !selected.loaded && !selected.inProgress),
    map(() => FavoriteStationsActions.fetchStationsStart())
  ));

  fetchOnInitialStationSelect$ = createEffect(() => this.actions$.pipe(
    ofType(selectStation),
    map(() => FavoriteStationsActions.fetchStationsSubmit())
  ));

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
    withLatestFrom(this.store.pipe(select(FavoriteStationsSelectors.selectCurrentStationOrMatchingFavorite))),
    filter(([, match]) => match.stationId == null),
    map(([, station]) => addToFavoritesStart({station}))
  ));

  addFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(addToFavoritesStart),
    mergeMap(action => this.favoriteStationsService.addFavorite(action.station).pipe(
      map(station => addToFavoritesSucceeded({station})),
      catchError(error => of(addToFavoritesFailed({station: action.station, error})))
    ))
  ));

  updateFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(FavoriteStationsActions.stationUpdateStart),
    mergeMap(({station}) => this.favoriteStationsService.updateFavorite(station.stationId, station).pipe(
      map(updated => FavoriteStationsActions.stationUpdateSucceeded({updated})),
      catchError(error => of(FavoriteStationsActions.stationUpdateFailed({station, error})))
    ))
  ));

  removeCurrentStationFromFavoritesRequested$ = createEffect(() => this.actions$.pipe(
    ofType(removeCurrentStationFromFavoritesRequested),
    withLatestFrom(this.store.pipe(select(FavoriteStationsSelectors.selectCurrentStationOrMatchingFavorite))),
    map(([, station]) => station.stationId),
    filter(stationId => stationId != null),
    map(stationId => removeFromFavoritesStart({stationId}))
  ));

  removeFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(removeFromFavoritesStart),
    mergeMap(action => this.favoriteStationsService.removeFavorite(action.stationId).pipe(
      map(() => removeFromFavoritesSucceeded({stationId: action.stationId})),
      catchError(error => of(removeFromFavoritesFailed({stationId: action.stationId, error})))
    ))
  ));

  openStationEditCurrent$ = createEffect(() => this.actions$.pipe(
    ofType(FavoriteStationsActions.openStationEditCurrent),
    withLatestFrom(this.store.pipe(select(FavoriteStationsSelectors.selectCurrentFavoriteStation))),
    map(([, current]) => current && current.stationId),
    filter(stationId => stationId != null),
    map(stationId => FavoriteStationsActions.openStationEditExisting({stationId}))
  ));

  notifyAddSucceeded$ = createEffect(() => this.actions$.pipe(
    ofType(addToFavoritesSucceeded),
    tap(action => this.notificationsService.success('Added To Favorites', `${action.station.title} has been added to favorites.`))
  ), { dispatch: false });

  notifyAddFailed$ = createEffect(() => this.actions$.pipe(
    ofType(addToFavoritesFailed),
    tap(action => this.notificationsService.error('Failed to Add To Favorites', `${action.station.title} was not added to favorites.`))
  ), { dispatch: false });

  notifyRemoveFailed$ = createEffect(() => this.actions$.pipe(
    ofType(removeFromFavoritesFailed),
    tap(() =>
      this.notificationsService.error('Failed to Remove From Favorites', `Station was not removed from favorites.`)
    )
  ), { dispatch: false });
}
