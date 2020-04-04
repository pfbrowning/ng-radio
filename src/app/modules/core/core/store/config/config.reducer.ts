import { Action, createReducer, on } from '@ngrx/store';
import { initialConfigState } from '../../models/config/initial-config-state';
import { configFetchSucceeded, configFetchFailed } from './config.actions';
import { ConfigState } from '../../models/config/config-state';

const reducer = createReducer<ConfigState>(
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
