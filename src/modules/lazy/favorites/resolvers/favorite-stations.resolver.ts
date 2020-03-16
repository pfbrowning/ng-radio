import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootState } from '@root-state';
import { map, filter, tap, take } from 'rxjs/operators';
import { selectFavoriteStationsResolverInput, fetchStationsStart } from '@root-state/favorite-stations';

@Injectable({providedIn: 'root'})
export class FavoriteStationsResolver implements Resolve<void> {
  constructor(private store: Store<RootState>) {}
  resolve(): Observable<void> {
    return this.store.pipe(
      select(selectFavoriteStationsResolverInput),
      filter(selected => !selected.isFetchInProgress),
      map(selected => selected.favoriteStations),
      tap(stations => {
        if(stations == null) {
          this.store.dispatch(fetchStationsStart());
        }
      }),
      filter(stations => stations != null),
      map(() => null),
      take(1)
    );
  }
}
