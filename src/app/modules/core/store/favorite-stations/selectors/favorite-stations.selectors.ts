import { createSelector } from '@ngrx/store';
import { RootState } from '../../../models/root-state';
import { FavoriteStationRow } from '../../../models/favorite-stations/favorite-station-row';
import { CurrentStationFavoritesProcessingState } from '../../../models/favorite-stations/current-station-favorites-processing-state';
import { Station } from '../../../models/player/station';
import { PlayerSelectors } from '../../player/selectors';

export const selectFavoriteStationsState = (state: RootState) => state.favoriteStations;

export const favoriteStationsArray = createSelector(
    selectFavoriteStationsState,
    (state) => state.favoriteStations
);

export const selectFavoriteStationsMap = createSelector(
    favoriteStationsArray,
    (favorites) => favorites && new Map<number, Station>(favorites.map(f => [f.stationId, f]))
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

export const favoriteStationRows = createSelector(
    favoriteStationsArray,
    selectRemoveInProgressIds,
    (stations, removing) => stations && stations.map(s => new FavoriteStationRow(s, removing.includes(s.stationId)))
);

export const favoritesFetchInProgress = createSelector(
    selectFavoriteStationsState,
    (state) => state.fetchInProgress
);

export const favoritesFetchFailed = createSelector(
    selectFavoriteStationsState,
    state => state.fetchFailed
);

export const addCurrentStationToFavoritesInProgress = createSelector(
    selectAddInProgressUrls,
    PlayerSelectors.currentStation,
    (inProgress, current) => current != null ? inProgress.includes(current.url) : false
);

export const favoriteMatchingCurrentStation = createSelector(
    favoriteStationsArray,
    PlayerSelectors.currentStation,
    (favorites, current) => favorites && current && favorites.find(f => f.stationId === current.stationId || f.url === current.url)
);

export const removeCurrentStationFromFavoritesInProgress = createSelector(
    selectRemoveInProgressIds,
    favoriteMatchingCurrentStation,
    (inProgress, current) => current && inProgress.includes(current.stationId)
);

export const currentStationFavoritesProcessingState = createSelector(
    favoritesFetchInProgress,
    addCurrentStationToFavoritesInProgress,
    removeCurrentStationFromFavoritesInProgress,
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

export const existingStationForEdit = createSelector(
    selectFavoriteStationsState,
    selectFavoriteStationsMap,
    (state, favorites) => favorites && state.editingStationId && favorites.get(state.editingStationId) || null
);

export const showEditModal = createSelector(
    selectFavoriteStationsState,
    state => state.showEditModal
);

export const editModalSaveInProgress = createSelector(
    existingStationForEdit,
    selectAddInProgressUrls,
    updateInProgressIds,
    (existing, adds, updates) => (existing && updates.includes(existing.stationId)) || (!existing && adds.length > 0)
);
