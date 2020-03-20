import { RootState } from './root-state';
import { initialFavoriteStationsState } from '../sections/favorite-stations/models/initial-favorite-stations-state';
import { initialPlayerState } from '../sections/player/models/initial-player-state';

export const initialRootState: RootState = {
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState
}