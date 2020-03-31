import { createSelector } from '@ngrx/store';
import { RootState } from '../../models/root-state';

export const selectSleepTimerState = (state: RootState) => state.sleepTimer;

export const selectSleepTime = createSelector(
    selectSleepTimerState,
    (state) => state.sleepTime
);

export const selectMinutesUntilSleep = createSelector(
    selectSleepTimerState,
    (state) => state.minutesUntilSleep
);
