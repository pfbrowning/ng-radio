import { Action, createReducer, on } from '@ngrx/store';
import { initialConfigState } from '../models/initial-config-state';
import { configFetchSucceeded, configFetchFailed } from './config.actions';
import { ConfigState } from '../models/config-state';

const reducer = createReducer(
  initialConfigState,
  on(configFetchSucceeded, configFetchFailed, state => ({
    ...state,
    initialized: true
  })),
  on(configFetchSucceeded, (state, {config}) => ({
    ...state,
    config,
  })),
);

export function configReducer(state: ConfigState | undefined, action: Action) {
  return reducer(state, action);
}
