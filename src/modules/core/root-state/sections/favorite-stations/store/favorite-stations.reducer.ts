import { Action, createReducer, on } from '@ngrx/store';
import { initialFavoriteStationsState } from '../models/initial-favorite-stations-state';
import { FavoriteStationsState } from '../models/favorite-stations-state';
import { fetchStationsStart, fetchStationsSucceeded, fetchStationsFailed } from './favorite-stations.actions';

const reducer = createReducer(
  initialFavoriteStationsState,
  on(fetchStationsStart, state => ({ ...state, fetchInProgress: true})),
  on(fetchStationsSucceeded, (state, {stations}) => ({
    ...state,
    favoriteStations: stations,
    fetchInProgress: false
  })),
  on(fetchStationsFailed, state => ({ ...state, fetchInProgress: false})),
);

export function favoriteStationsReducer(state: FavoriteStationsState | undefined, action: Action) {
  return reducer(state, action);
}
