import { FavoriteStationsState } from '../sections/favorite-stations/models/favorite-stations-state';
import { PlayerState } from '../sections/player/models/player-state';

export interface RootState {
    favoriteStations: FavoriteStationsState,
    player: PlayerState
}