import { ActionReducerMap } from '@ngrx/store';
import { RootState } from './models/root-state';
import { favoriteStationsReducer } from './sections/favorite-stations/store/favorite-stations.reducer';

export const reducers: ActionReducerMap<RootState> = {
    favoriteStations: favoriteStationsReducer
};