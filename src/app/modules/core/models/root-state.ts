import { RouterReducerState } from '@ngrx/router-store';
import { AuthenticationState } from '../store/authentication/models/authentication-state';
import { FavoriteStationsState } from '../store/favorite-stations/models/favorite-stations-state';
import { PlayerState } from '../store/player/models/player-state';
import { StreamMetadataState } from '../store/stream-metadata/models/stream-metadata-state';
import { RadioBrowserResultsState } from '../store/radio-browser-results/models/radio-browser-results-state';

export interface RootState {
  router: RouterReducerState;
  favoriteStations: FavoriteStationsState;
  player: PlayerState;
  authentication: AuthenticationState;
  streamMetadata: StreamMetadataState;
  radioBrowserResults: RadioBrowserResultsState;
}
