import { createAction, props } from '@ngrx/store';

export enum SleepTimerActions {
    SetSleepTimerSubmit = '[Sleep Timer] Set Sleep Timer Submit',
    SleepTimerSet = '[Sleep Timer] Sleep Timer Set',
    ClearSleepTimer = '[Sleep Timer] Clear Sleep Timer',
    GoToSleep = '[Sleep Timer] Go To Sleep',
    CountMinutesUntilSleep = '[Sleep Timer] Count Minutes Until Sleep',
    SetMinutesUntilSleep = '[Sleep Timer] Set Minutes Until Sleep',
}

export const setSleepTimerSubmit = createAction(
    SleepTimerActions.SetSleepTimerSubmit,
    props<{ minutes: number }>()
);

export const sleepTimerSet = createAction(
    SleepTimerActions.SleepTimerSet,
    props<{ sleepTime: number }>()
);

export const countMinutesUntilSleep = createAction(
    SleepTimerActions.CountMinutesUntilSleep,
);

export const setMinutesUntilSleep = createAction(
    SleepTimerActions.SetMinutesUntilSleep,
    props<{ minutesUntilSleep: number }>()
);

export const clearSleepTimer = createAction(
    SleepTimerActions.ClearSleepTimer
);

export const goToSleep = createAction(
    SleepTimerActions.GoToSleep
);