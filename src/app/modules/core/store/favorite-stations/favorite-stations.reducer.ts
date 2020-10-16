import { createReducer, on } from '@ngrx/store';
import { FavoriteStationsActions } from './actions';
import { initialFavoriteStationsState } from './models/initial-favorite-stations-state';
import { FavoriteStationsState } from './models/favorite-stations-state';
import { RouteResolverActions } from './actions';

export const favoriteStationsReducer = createReducer<FavoriteStationsState>(
    initialFavoriteStationsState,
    on(RouteResolverActions.init, (state) => ({
        ...state,
        fetchFailed: false,
    })),
    on(FavoriteStationsActions.fetchStationsStart, (state) => ({
        ...state,
        fetchInProgress: true,
    })),
    on(
        FavoriteStationsActions.fetchStationsSucceeded,
        (state, { stations }) => ({
            ...state,
            favoriteStations: stations,
            fetchInProgress: false,
        })
    ),
    on(FavoriteStationsActions.fetchStationsFailed, (state) => ({
        ...state,
        fetchInProgress: false,
        fetchFailed: true,
    })),
    on(FavoriteStationsActions.addToFavoritesStart, (state, { station }) => ({
        ...state,
        addInProgressUrls: state.addInProgressUrls.concat(station.url),
    })),
    on(
        FavoriteStationsActions.addToFavoritesSucceeded,
        (state, { station }) => ({
            ...state,
            addInProgressUrls: state.addInProgressUrls.filter(
                (p) => p !== station.url
            ),
            favoriteStations: state.favoriteStations.concat(station),
            showEditModal: false,
        })
    ),
    on(FavoriteStationsActions.addToFavoritesFailed, (state, { station }) => ({
        ...state,
        addInProgressUrls: state.addInProgressUrls.filter(
            (p) => p !== station.url
        ),
    })),
    on(
        FavoriteStationsActions.removeFromFavoritesStart,
        (state, { stationId }) => ({
            ...state,
            removeInProgressIds: state.removeInProgressIds.concat(stationId),
        })
    ),
    on(
        FavoriteStationsActions.removeFromFavoritesSucceeded,
        (state, { stationId }) => ({
            ...state,
            removeInProgressIds: state.removeInProgressIds.filter(
                (ip) => ip !== stationId
            ),
            favoriteStations: state.favoriteStations.filter(
                (f) => f.stationId !== stationId
            ),
        })
    ),
    on(
        FavoriteStationsActions.removeFromFavoritesFailed,
        (state, { stationId }) => ({
            ...state,
            removeInProgressIds: state.removeInProgressIds.filter(
                (ip) => ip !== stationId
            ),
        })
    ),
    on(FavoriteStationsActions.openStationEditNew, (state) => ({
        ...state,
        showEditModal: true,
        editingStationId: null,
    })),
    on(
        FavoriteStationsActions.openStationEditExisting,
        (state, { stationId }) => ({
            ...state,
            showEditModal: true,
            editingStationId: stationId,
        })
    ),
    on(FavoriteStationsActions.closeStationEdit, (state) => ({
        ...state,
        showEditModal: false,
        editingStationId: null,
    })),
    on(FavoriteStationsActions.stationUpdateStart, (state, { station }) => ({
        ...state,
        updateInProgressIds: state.updateInProgressIds.concat(
            station.stationId
        ),
    })),
    on(FavoriteStationsActions.stationUpdateFailed, (state, { station }) => ({
        ...state,
        updateInProgressIds: state.updateInProgressIds.filter(
            (s) => s !== station.stationId
        ),
    })),
    on(
        FavoriteStationsActions.stationUpdateSucceeded,
        (state, { updated }) => ({
            ...state,
            updateInProgressIds: state.updateInProgressIds.filter(
                (s) => s !== updated.stationId
            ),
            favoriteStations: state.favoriteStations.map((f) =>
                f.stationId === updated.stationId ? updated : f
            ),
            editingStationId: null,
        })
    )
);
