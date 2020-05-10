import { RootState } from './root-state';
import { initialAuthenticationState } from './authentication/initial-authentication-state';
import { initialConfigState } from './config/initial-config-state';
import { initialFavoriteStationsState } from './favorite-stations/initial-favorite-stations-state';
import { initialPlayerState } from './player/initial-player-state';
import { initialSleepTimerState } from './sleep-timer/initial-sleep-timer-state';
import { initialApplicationState } from './application/initial-application-state';
import { initialRouterExtendedState } from './router-extended/initial-router-extended-state';

export const initialRootState: RootState = {
    router: null,
    routerExtended: initialRouterExtendedState,
    favoriteStations: initialFavoriteStationsState,
    player: initialPlayerState,
    sleepTimer: initialSleepTimerState,
    authentication: initialAuthenticationState,
    config: initialConfigState,
    application: initialApplicationState
};
