import { AuthenticationState } from './authentication/authentication-state';
import { ConfigState } from '@config';
import { FavoriteStationsState } from './favorite-stations/favorite-stations-state';
import { PlayerState } from './player/player-state';
import { SleepTimerState } from './sleep-timer/sleep-timer-state';

export interface RootState {
    favoriteStations: FavoriteStationsState;
    player: PlayerState;
    sleepTimer: SleepTimerState;
    authentication: AuthenticationState;
    config: ConfigState;
}
