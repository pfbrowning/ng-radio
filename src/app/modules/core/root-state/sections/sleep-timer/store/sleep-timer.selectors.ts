import { RootState } from '../../../models/root-state';
import { createSelector } from '@ngrx/store';

export const selectSleepTimerState = (state: RootState) => state.sleepTimer;

export const selectSleepTime = createSelector(
    selectSleepTimerState,
    (state) => state.sleepTime
);

export const selectMinutesUntilSleep = createSelector(
    selectSleepTimerState,
    (state) => state.minutesUntilSleep
);
