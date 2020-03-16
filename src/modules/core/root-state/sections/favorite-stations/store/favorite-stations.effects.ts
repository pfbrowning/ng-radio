import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { fetchStationsStart, fetchStationsSucceeded, fetchStationsFailed } from './favorite-stations.actions';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { FavoriteStationsService } from '@core-radio-logic';

@Injectable()
export class FavoriteStationsEffects {
  constructor(private actions$: Actions, private favoriteStationsService: FavoriteStationsService) {}

  fetchStations$ = createEffect(() => this.actions$.pipe(
    ofType(fetchStationsStart),
    switchMap(() =>
      this.favoriteStationsService.fetchAll().pipe(
        map(stations => fetchStationsSucceeded({stations})),
        catchError(error => of(fetchStationsFailed({error})))
      )
    )
  ));
}
