import { Action, createReducer, on } from '@ngrx/store';
import {
  fetchStationsStart,
  fetchStationsSucceeded,
  fetchStationsFailed,
  addToFavoritesStart,
  addToFavoritesSucceeded,
  addToFavoritesFailed,
  removeFromFavoritesStart,
  removeFromFavoritesSucceeded,
  removeFromFavoritesFailed
} from './favorite-stations.actions';
import { initialFavoriteStationsState } from '../../models/favorite-stations/initial-favorite-stations-state';
import { FavoriteStationsState } from '../../models/favorite-stations/favorite-stations-state';
import { FavoriteStationsActions } from '.';

const reducer = createReducer<FavoriteStationsState>(
  initialFavoriteStationsState,
  on(fetchStationsStart, state => ({ ...state, fetchInProgress: true})),
  on(fetchStationsSucceeded, (state, {stations}) => ({
    ...state,
    favoriteStations: stations,
    fetchInProgress: false
  })),
  on(fetchStationsFailed, state => ({
    ...state,
    fetchInProgress: false,
    fetchFailed: true
  })),
  on(addToFavoritesStart, (state, {station}) => ({
    ...state,
    addInProgressUrls: state.addInProgressUrls.concat(station.url)
  })),
  on(addToFavoritesSucceeded, (state, {station}) => ({
    ...state,
    addInProgressUrls: state.addInProgressUrls.filter(p => p !== station.url),
    favoriteStations: state.favoriteStations.concat(station),
    editingNew: false
  })),
  on(addToFavoritesFailed, (state, {station}) => ({
    ...state,
    addInProgressUrls: state.addInProgressUrls.filter(p => p !== station.url),
  })),
  on(removeFromFavoritesStart, (state, {stationId}) => ({
    ...state,
    removeInProgressIds: state.removeInProgressIds.concat(stationId)
  })),
  on(removeFromFavoritesSucceeded, (state, {stationId}) => ({
    ...state,
    removeInProgressIds: state.removeInProgressIds.filter(ip => ip !== stationId),
    favoriteStations: state.favoriteStations.filter(f => f.stationId !== stationId)
  })),
  on(removeFromFavoritesFailed, (state, {stationId}) => ({
    ...state,
    removeInProgressIds: state.removeInProgressIds.filter(ip => ip !== stationId),
  })),
  on(FavoriteStationsActions.openStationEditNew, state => ({
    ...state,
    editingNew: true,
    editingStationId: null
  })),
  on(FavoriteStationsActions.openStationEditExisting, (state, {stationId}) => ({
    ...state,
    editingNew: false,
    editingStationId: stationId
  })),
  on(FavoriteStationsActions.closeStationEdit, state => ({
    ...state,
    editingNew: false,
    editingStationId: null
  })),
  on(FavoriteStationsActions.stationUpdateStart, (state, {station}) => ({
    ...state,
    updateInProgressIds: state.updateInProgressIds.concat(station.stationId)
  })),
  on(FavoriteStationsActions.stationUpdateFailed, (state, {station}) => ({
    ...state,
    updateInProgressIds: state.updateInProgressIds.filter(s => s !== station.stationId)
  })),
  on(FavoriteStationsActions.stationUpdateSucceeded, (state, {updated}) => ({
    ...state,
    updateInProgressIds: state.updateInProgressIds.filter(s => s !== updated.stationId),
    favoriteStations: state.favoriteStations.map(f => f.stationId === updated.stationId ? updated : f),
    editingStationId: null
  })),
);

export function favoriteStationsReducer(state: FavoriteStationsState | undefined, action: Action) {
  return reducer(state, action);
}
