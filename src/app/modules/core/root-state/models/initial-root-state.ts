import { RootState } from './root-state';
import { initialFavoriteStationsState } from '../sections/favorite-stations/models/initial-favorite-stations-state';
import { initialPlayerState } from '../sections/player/models/initial-player-state';
import { initialSleepTimerState } from '../sections/sleep-timer/models/initial-sleep-timer-state';
import { initialAuthenticationState } from '@authentication';
import { initialConfigState } from '@config';

export const initialRootState: RootState = {
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    sleepTimer: initialSleepTimerState,
    authentication: initialAuthenticationState,
    config: initialConfigState
};
