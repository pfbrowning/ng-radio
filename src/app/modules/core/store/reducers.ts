import { ActionReducerMap } from '@ngrx/store';
import { RootState } from '../models/root-state';
import { favoriteStationsReducer } from './favorite-stations/favorite-stations.reducer';
import { playerReducer } from './player/player.reducer';
import { authenticationReducer } from './authentication/authentication.reducer';
import { streamMetadataReducer } from './stream-metadata/reducer';

export const reducers: ActionReducerMap<RootState> = {
    favoriteStations: favoriteStationsReducer,
    player: playerReducer,
    authentication: authenticationReducer,
    streamMetadata: streamMetadataReducer
};
