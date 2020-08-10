import { RouterReducerState } from '@ngrx/router-store';
import { AuthenticationState } from '../store/authentication/models/authentication-state';
import { FavoriteStationsState } from './favorite-stations/favorite-stations-state';
import { PlayerState } from './player/player-state';
import { StreamMetadataState } from '../store/stream-metadata/models/stream-metadata-state';
import { SocketIOState } from '../store/socket-io/models/socket-io-state';

export interface RootState {
    router: RouterReducerState;
    favoriteStations: FavoriteStationsState;
    player: PlayerState;
    authentication: AuthenticationState;
    streamMetadata: StreamMetadataState;
    socketIOState: SocketIOState;
}
