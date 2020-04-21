import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';
import { FavoriteStationRow } from '../../models/favorite-stations/favorite-station-row';
import { selectCurrentStation } from '../player/player.selectors';
import { CurrentStationFavoritesProcessingState } from '../../models/favorite-stations/current-station-favorites-processing-state';
import { Station } from '../../models/player/station';

export const selectFavoriteStationsState = (state: RootState) => state.favoriteStations;

export const selectFavoriteStations = createSelector(
    selectFavoriteStationsState,
    (state) => state.favoriteStations
);

export const selectFavoriteStationsMap = createSelector(
    selectFavoriteStations,
    (favorites) => favorites && new Map<number, Station>(favorites.map(f => [f.stationId, f]))
);

export const selectAreFavoriteStationsLoaded = createSelector(
    selectFavoriteStations,
    (favoriteStations) => favoriteStations != null
);

export const selectAddInProgressUrls = createSelector(
    selectFavoriteStationsState,
    (state) => state.addInProgressUrls
);

export const selectRemoveInProgressIds = createSelector(
    selectFavoriteStationsState,
    (state) => state.removeInProgressIds
);

export const updateInProgressIds = createSelector(
    selectFavoriteStationsState,
    state => state.updateInProgressIds
);

export const selectFavoriteStationRows = createSelector(
    selectFavoriteStations,
    selectRemoveInProgressIds,
    (stations, removing) => stations != null
        ? stations.map(s => new FavoriteStationRow(s, removing.includes(s.stationId)))
        : []
);

export const selectIsFavoriteStationFetchInProgress = createSelector(
    selectFavoriteStationsState,
    (state) => state.fetchInProgress
);

export const selectDidFavoriteStationsFailToLoad = createSelector(
    selectFavoriteStationsState,
    state => state.fetchFailed
);

export const selectIsAddCurrentStationToFavoritesInProgress = createSelector(
    selectAddInProgressUrls,
    selectCurrentStation,
    (inProgress, current) => current != null ? inProgress.includes(current.url) : false
);

export const selectCurrentFavoriteStation = createSelector(
    selectFavoriteStations,
    selectCurrentStation,
    (favorites, current) => favorites && current && favorites.find(f => f.stationId === current.stationId || f.url === current.url)
);

export const selectCurrentStationOrMatchingFavorite = createSelector(
    selectCurrentStation,
    selectCurrentFavoriteStation,
    (current, match) => match || current
);

export const selectIsRemoveCurrentStationFromFavoritesInProgress = createSelector(
    selectRemoveInProgressIds,
    selectCurrentFavoriteStation,
    (inProgress, current) => current && inProgress.includes(current.stationId)
);

export const selectIsProcessingFavoritesForCurrentStation = createSelector(
    selectIsFavoriteStationFetchInProgress,
    selectIsAddCurrentStationToFavoritesInProgress,
    selectIsRemoveCurrentStationFromFavoritesInProgress,
    (fetching, adding, removing) => fetching || adding || removing
);

export const selectCurrentStationFavoritesProcessingState = createSelector(
    selectIsFavoriteStationFetchInProgress,
    selectIsAddCurrentStationToFavoritesInProgress,
    selectIsRemoveCurrentStationFromFavoritesInProgress,
    (fetching, adding, removing) => {
        if (fetching) {
            return CurrentStationFavoritesProcessingState.Loading;
        }
        if (adding) {
            return CurrentStationFavoritesProcessingState.Adding;
        }
        if (removing) {
            return CurrentStationFavoritesProcessingState.Removing;
        }
        return null;
    }
);

export const selectFavoriteStationsLoadingStatus = createSelector(
    selectAreFavoriteStationsLoaded,
    selectIsFavoriteStationFetchInProgress,
    selectDidFavoriteStationsFailToLoad,
    (loaded, inProgress, failed) => ({loaded, inProgress, failed})
);

export const editStationExisting = createSelector(
    selectFavoriteStationsState,
    selectFavoriteStationsMap,
    (state, favorites) => favorites && state.editingStationId && favorites.get(state.editingStationId)
);

export const editingNewStation = createSelector(
    selectFavoriteStationsState,
    state => state.editingNew
);

export const editStationSaveInProgress = createSelector(
    editStationExisting,
    editingNewStation,
    selectAddInProgressUrls,
    updateInProgressIds,
    (existing, editingNew, adds, updates) => (existing && updates.includes(existing.stationId)) || (editingNew && adds.length > 0)
);
