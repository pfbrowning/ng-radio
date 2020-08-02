import { RootState } from './root-state';
import { initialFavoriteStationsState } from './favorite-stations/initial-favorite-stations-state';
import { initialPlayerState } from './player/initial-player-state';
import { initialAuthenticationState } from '../store/authentication/models/initial-authentication-state';

export const initialRootState: RootState = {
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    authentication: initialAuthenticationState
};
