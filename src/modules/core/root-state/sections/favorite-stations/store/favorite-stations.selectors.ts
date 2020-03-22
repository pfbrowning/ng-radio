import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';
import { selectCurrentStation } from '../../player/store/player.selectors';

export const selectFavoriteStationsState = (state: RootState) => state.favoriteStations;

export const selectFavoriteStations = createSelector(
    selectFavoriteStationsState,
    (state) => state.favoriteStations
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
)

export const selectIsFavoriteStationFetchInProgress = createSelector(
    selectFavoriteStationsState,
    (state) => state.fetchInProgress
);

export const selectIsAddCurrentStationToFavoritesInProgress = createSelector(
    selectAddInProgressUrls,
    selectCurrentStation,
    (inProgress, current) => inProgress.includes(current.url)
)

export const selectCurrentFavoriteStation = createSelector(
    selectFavoriteStations,
    selectCurrentStation,
    (favorites, current) => favorites != null && current != null
        ? favorites.find(f => f.stationId === current.stationId || f.url === current.url)
        : null
)

export const selectCurrentFavoriteStationId = createSelector(
    selectCurrentFavoriteStation,
    favorite => favorite != null ? favorite.stationId : null
)

export const selectIsRemoveCurrentStationFromFavoritesInProgress = createSelector(
    selectRemoveInProgressIds,
    selectCurrentFavoriteStationId,
    (inProgress, current) => inProgress.includes(current)
);

export const selectIsProcessingFavoritesForCurrentStation = createSelector(
    selectIsFavoriteStationFetchInProgress,
    selectIsAddCurrentStationToFavoritesInProgress,
    selectIsRemoveCurrentStationFromFavoritesInProgress,
    (fetching, adding, removing) => fetching || adding || removing
);

export const selectCurrentStationFavoritesProcessingLabel = createSelector(
    selectIsFavoriteStationFetchInProgress,
    selectIsAddCurrentStationToFavoritesInProgress,
    selectIsRemoveCurrentStationFromFavoritesInProgress,
    (fetching, adding, removing) => {
        if(fetching) {
            return "Loading Favorites";
        }
        if(adding) {
            return "Adding Current Station To Favorites";
        }
        if(removing) {
            return "Removing Current Station From Favorites";
        }
        return "";
    }
)

export const selectFavoriteStationsLoadingStatus = createSelector(
    selectAreFavoriteStationsLoaded,
    selectIsFavoriteStationFetchInProgress,
    (loaded, inProgress) => ({loaded, inProgress})
)

export const selectIsCurrentStationInFavorites = createSelector(
    selectCurrentFavoriteStation,
    favorite => favorite != null
)