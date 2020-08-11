import { RootState } from './root-state';
import { initialFavoriteStationsState } from './favorite-stations/initial-favorite-stations-state';
import { initialPlayerState } from './player/initial-player-state';
import { initialAuthenticationState } from '../store/authentication/models/initial-authentication-state';
import { initialStreamMetadataState } from '../store/stream-metadata/models/initial-stream-metadata-state';
import { initialRadioBrowserResultsState } from '../store/radio-browser-results/models/initial-radio-browser-results-state';

export const initialRootState: RootState = {
    router: null,
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    authentication: initialAuthenticationState,
    streamMetadata: initialStreamMetadataState,
    radioBrowserResults: initialRadioBrowserResultsState
};
