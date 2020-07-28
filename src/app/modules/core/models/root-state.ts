import { AuthenticationState } from './authentication/authentication-state';
import { FavoriteStationsState } from './favorite-stations/favorite-stations-state';
import { PlayerState } from './player/player-state';
import { SleepTimerState } from './sleep-timer/sleep-timer-state';
import { ApplicationState } from './application/application-state';
import { RouterReducerState } from '@ngrx/router-store';
import { RouterExtendedState } from './router-extended/router-extended-state';

export interface RootState {
    router: RouterReducerState;
    routerExtended: RouterExtendedState;
    favoriteStations: FavoriteStationsState;
    player: PlayerState;
    sleepTimer: SleepTimerState;
    authentication: AuthenticationState;
    application: ApplicationState;
}
