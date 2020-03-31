import { RootState } from './root-state';
import { initialAuthenticationState } from './authentication/initial-authentication-state';
import { initialConfigState } from '@config';
import { initialFavoriteStationsState } from './favorite-stations/initial-favorite-stations-state';
import { initialPlayerState } from './player/initial-player-state';
import { initialSleepTimerState } from './sleep-timer/initial-sleep-timer-state';

export const initialRootState: RootState = {
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    sleepTimer: initialSleepTimerState,
    authentication: initialAuthenticationState,
    config: initialConfigState
};
