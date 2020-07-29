import { ActionReducerMap } from '@ngrx/store';
import { RootState } from '../models/root-state';
import { routerReducer } from '@ngrx/router-store';
import { routerExtendedReducer } from './router-extended/router-extended.reducer';
import { favoriteStationsReducer } from './favorite-stations/favorite-stations.reducer';
import { playerReducer } from './player/player.reducer';
import { sleepTimerReducer } from './sleep-timer/sleep-timer.reducer';
import { authenticationReducer } from './authentication/authentication.reducer';

export const reducers: ActionReducerMap<RootState> = {
    router: routerReducer,
    routerExtended: routerExtendedReducer,
    favoriteStations: favoriteStationsReducer,
    player: playerReducer,
    sleepTimer: sleepTimerReducer,
    authentication: authenticationReducer
};
