import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { RootState } from '../models/root-state';
import { favoriteStationsReducer } from './favorite-stations/favorite-stations.reducer';
import { playerReducer } from './player/player.reducer';
import { authenticationReducer } from './authentication/authentication.reducer';
import { streamMetadataReducer } from './stream-metadata/reducer';
import { socketIOReducer } from './socket-io/reducer';

export const reducers: ActionReducerMap<RootState> = {
    router: routerReducer,
    favoriteStations: favoriteStationsReducer,
    player: playerReducer,
    authentication: authenticationReducer,
    streamMetadata: streamMetadataReducer,
    socketIOState: socketIOReducer
};
