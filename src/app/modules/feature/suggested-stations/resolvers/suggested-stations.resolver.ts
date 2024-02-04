import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { SuggestedStationsRootState } from '../models/suggested-stations-root-state';
import { Store, select } from '@ngrx/store';
import { selectAreSuggestedStationsPresentOrFailed } from '../store/suggested-stations.selectors';

@Injectable()
export class SuggestedStationsResolver  {
  constructor(private store: Store<SuggestedStationsRootState>) {}

  resolve(): Observable<void> {
    return this.store.pipe(
      select(selectAreSuggestedStationsPresentOrFailed),
      filter(resolved => resolved),
      map(() => null),
      take(1)
    );
  }
}
