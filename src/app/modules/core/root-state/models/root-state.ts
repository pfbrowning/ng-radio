import { FavoriteStationsState } from '../sections/favorite-stations/models/favorite-stations-state';
import { PlayerState } from '../sections/player/models/player-state';
import { SleepTimerState } from '../sections/sleep-timer/models/sleep-timer-state';
import { AuthenticationState } from '../sections/authentication/models/authentication-state';

export interface RootState {
    favoriteStations: FavoriteStationsState;
    player: PlayerState;
    sleepTimer: SleepTimerState;
    authentication: AuthenticationState;
}
