import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { RootState } from '../models/root-state';
import { favoriteStationsReducer } from './favorite-stations/favorite-stations.reducer';
import { playerReducer } from './player/player.reducer';
import { authenticationReducer } from './authentication/authentication.reducer';
import { streamMetadataReducer } from './stream-metadata/reducer';
import { radioBrowserResultsReducer } from './radio-browser-results/reducer';
import { configReducer } from './config/config.reducer';

// TODO implement the Socket.IO reducer

export const reducers: ActionReducerMap<RootState> = {
  config: configReducer,
  router: routerReducer,
  favoriteStations: favoriteStationsReducer,
  player: playerReducer,
  authentication: authenticationReducer,
  streamMetadata: streamMetadataReducer,
  radioBrowserResults: radioBrowserResultsReducer,
};
