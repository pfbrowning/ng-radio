import { ActionReducerMap } from '@ngrx/store';
import { RootState } from './models/root-state';
import { favoriteStationsReducer } from './sections/favorite-stations/store/favorite-stations.reducer';
import { playerReducer } from './sections/player/store/player.reducer';
import { sleepTimerReducer } from './sections/sleep-timer/store/sleep-timer.reducer';
import { authenticationReducer } from './sections/authentication/store/authentication.reducer';

export const reducers: ActionReducerMap<RootState> = {
    favoriteStations: favoriteStationsReducer,
    player: playerReducer,
    sleepTimer: sleepTimerReducer,
    authentication: authenticationReducer
};
