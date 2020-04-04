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

const reducer = createReducer(
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
    favoriteStations: state.favoriteStations.concat(station)
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
);

export function favoriteStationsReducer(state: FavoriteStationsState | undefined, action: Action) {
  return reducer(state, action);
}
