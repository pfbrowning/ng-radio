import { Injectable } from '@angular/core';
import { RootState } from '../../models/root-state';
import { Store, select } from '@ngrx/store';
import { FavoriteStationsSelectors } from './selectors';

@Injectable({ providedIn: 'root' })
export class FavoriteStationsFacadeService {
  public favoriteStationsArray$ = this.store.pipe(
    select(FavoriteStationsSelectors.favoriteStationsArray)
  );
  public currentStationFavoritesProcessingState$ = this.store.pipe(
    select(FavoriteStationsSelectors.currentStationFavoritesProcessingState)
  );

  public showEditModal$ = this.store.pipe(select(FavoriteStationsSelectors.showEditModal));
  public existingStationForEdit$ = this.store.pipe(
    select(FavoriteStationsSelectors.existingStationForEdit)
  );
  public editModalSaveInProgress$ = this.store.pipe(
    select(FavoriteStationsSelectors.editModalSaveInProgress)
  );

  public favoritesFetchInProgress$ = this.store.pipe(
    select(FavoriteStationsSelectors.favoritesFetchInProgress)
  );
  public favoritesFetchFailed$ = this.store.pipe(
    select(FavoriteStationsSelectors.favoritesFetchFailed)
  );

  public favoriteMatchingCurrentStation$ = this.store.pipe(
    select(FavoriteStationsSelectors.favoriteMatchingCurrentStation)
  );
  public favoriteStationRows$ = this.store.pipe(
    select(FavoriteStationsSelectors.favoriteStationRows)
  );

  constructor(private store: Store<RootState>) {}
}
