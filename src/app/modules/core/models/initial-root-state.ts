import { RootState } from './root-state';
import { initialFavoriteStationsState } from '../store/favorite-stations/models/initial-favorite-stations-state';
import { initialPlayerState } from '../store/player/models/initial-player-state';
import { initialAuthenticationState } from '../store/authentication/models/initial-authentication-state';
import { initialStreamMetadataState } from '../store/stream-metadata/models/initial-stream-metadata-state';
import { initialRadioBrowserResultsState } from '../store/radio-browser-results/models/initial-radio-browser-results-state';

export const initialRootState: RootState = {
  router: null,
  favoriteStations: initialFavoriteStationsState,
  player: initialPlayerState,
  authentication: initialAuthenticationState,
  streamMetadata: initialStreamMetadataState,
  radioBrowserResults: initialRadioBrowserResultsState,
};
