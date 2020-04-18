import { Action, createReducer, on } from '@ngrx/store';
import { ApplicationState } from '../../models/application/application-state';
import { initialApplicationState } from '../../models/application/initial-application-state';
import { ApplicationActions } from '.';

const reducer = createReducer<ApplicationState>(
  initialApplicationState,
  on(ApplicationActions.windowFocus, state => ({
    ...state,
    windowHasFocus: true
  })),
  on(ApplicationActions.windowBlur, state => ({
    ...state,
    windowHasFocus: false
  })),
  on(ApplicationActions.toasterInitialized, state => ({
    ...state,
    toasterInitialized: true
  })),
);

export function applicationReducer(state: ApplicationState | undefined, action: Action) {
  return reducer(state, action);
}
