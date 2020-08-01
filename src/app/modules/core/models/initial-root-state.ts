import { RootState } from './root-state';
import { initialFavoriteStationsState } from './favorite-stations/initial-favorite-stations-state';
import { initialPlayerState } from './player/initial-player-state';
import { initialSleepTimerState } from './sleep-timer/initial-sleep-timer-state';
import { initialRouterExtendedState } from './router-extended/initial-router-extended-state';
import { initialAuthenticationState } from '../store/authentication/models/initial-authentication-state';

export const initialRootState: RootState = {
    router: null,
    routerExtended: initialRouterExtendedState,
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    sleepTimer: initialSleepTimerState,
    authentication: initialAuthenticationState
};
