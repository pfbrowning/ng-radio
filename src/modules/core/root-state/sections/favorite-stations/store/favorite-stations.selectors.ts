import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';

export const selectFavoriteStationsState = (state: RootState) => state.favoriteStations;

export const selectFavoriteStations = createSelector(
    selectFavoriteStationsState,
    (state) => state.favoriteStations
);

export const selectAreFavoriteStationsLoaded = createSelector(
    selectFavoriteStations,
    (favoriteStations) => favoriteStations != null
);

export const selectIsFavoriteStationFetchInProgress = createSelector(
    selectFavoriteStationsState,
    (state) => state.fetchInProgress
);

export const selectFavoriteStationsLoadingStatus = createSelector(
    selectAreFavoriteStationsLoaded,
    selectIsFavoriteStationFetchInProgress,
    (loaded, inProgress) => ({loaded, inProgress})
)