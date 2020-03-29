import { Action, createReducer, on } from '@ngrx/store';
import { initialSleepTimerState } from '../models/initial-sleep-timer-state';
import { sleepTimerSet, clearSleepTimer, goToSleep, setMinutesUntilSleep } from './sleep-timer.actions';
import { SleepTimerState } from '../models/sleep-timer-state';

const reducer = createReducer(
  initialSleepTimerState,
  on(sleepTimerSet, (state, { sleepTime }) => ({
    ...state,
    sleepTime
  })),
  on(clearSleepTimer, goToSleep, state => ({
    ...state,
    sleepTime: null,
    minutesUntilSleep: null
  })),
  on(setMinutesUntilSleep, (state, { minutesUntilSleep }) => ({
    ...state,
    minutesUntilSleep
  })),
);

export function sleepTimerReducer(state: SleepTimerState | undefined, action: Action) {
  return reducer(state, action);
}
