import { Injectable } from '@angular/core';

import { Observable, combineLatest } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';
import { FavoriteStationsFacadeService } from '@core/store';
import { FavoriteStationsFeatureFacadeService } from '../store/favorite-stations-feature-facade.service';

@Injectable({ providedIn: 'root' })
export class FavoriteStationsResolver {
  constructor(
    private favoriteStationsFeatureFacadeService: FavoriteStationsFeatureFacadeService,
    private favoriteStationsFacade: FavoriteStationsFacadeService
  ) {}
  resolve(): Observable<void> {
    this.favoriteStationsFeatureFacadeService.routeResolveInit();

    return combineLatest([
      this.favoriteStationsFacade.favoriteStationsArray$,
      this.favoriteStationsFacade.favoritesFetchFailed$,
    ]).pipe(
      filter(([stations, failed]) => stations != null || failed),
      take(1),
      map(() => null)
    );
  }
}
