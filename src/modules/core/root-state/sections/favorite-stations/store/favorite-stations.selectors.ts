import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';

export const selectFavoriteStationsState = (state: RootState) => state.favoriteStations;

export const selectFavoriteStations = createSelector(
    selectFavoriteStationsState,
    (state) => state.favoriteStations
);

export const selectIsFavoriteStationFetchInProgress = createSelector(
    selectFavoriteStationsState,
    (state) => state.fetchInProgress
);

export const selectFavoriteStationsResolverInput = createSelector(
    selectFavoriteStations,
    selectIsFavoriteStationFetchInProgress,
    (favoriteStations, isFetchInProgress) => ({favoriteStations, isFetchInProgress})
)