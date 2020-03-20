import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';
import { selectFavoriteStations } from '../../favorite-stations/store/favorite-stations.selectors';

export const selectPlayerState = (state: RootState) => state.player;

export const selectCurrentStation = createSelector(
    selectPlayerState,
    (state) => state.currentStation
);

export const selectCurrentFavoriteStation = createSelector(
    selectFavoriteStations,
    selectCurrentStation,
    (favorites, current) => favorites != null
        ? favorites.find(f => f.stationId === current.stationId || f.url === current.url)
        : null
)

export const selectCurrentFavoriteStationId = createSelector(
    selectCurrentFavoriteStation,
    favorite => favorite != null ? favorite.stationId : null
)

export const selectIsCurrentStationInFavorites = createSelector(
    selectCurrentFavoriteStation,
    favorite => favorite != null
)