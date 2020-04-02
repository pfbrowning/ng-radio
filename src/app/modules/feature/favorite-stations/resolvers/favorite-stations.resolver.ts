import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { map, filter, tap, take } from 'rxjs/operators';
import { fetchStationsStart, selectFavoriteStationsLoadingStatus } from '@core/store/favorite-stations';

@Injectable({providedIn: 'root'})
export class FavoriteStationsResolver implements Resolve<void> {
  constructor(private store: Store<RootState>) {}
  resolve(): Observable<void> {
    return this.store.pipe(
      select(selectFavoriteStationsLoadingStatus),
      filter(selected => !selected.inProgress),
      tap(selected => {
        if (!selected.loaded && !selected.failed) {
          this.store.dispatch(fetchStationsStart());
        }
      }),
      filter(selected => selected.loaded || selected.failed),
      map(() => null),
      take(1)
    );
  }
}
