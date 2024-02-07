import { createReducer, on } from '@ngrx/store';
import { ConfigState } from './config-state';
import { initialConfigState } from './initial-config-state';
import { ConfigActions } from './actions';
import { merge } from 'lodash-es';

export const configReducer = createReducer<ConfigState>(
  initialConfigState,
  on(
    ConfigActions.fetchConfigStart,
    (state): ConfigState => ({
      ...state,
      fetchInProgress: true,
      fetchFailed: false,
    })
  ),
  on(
    ConfigActions.fetchConfigFailed,
    (state): ConfigState => ({
      ...state,
      fetchInProgress: false,
      fetchFailed: true,
    })
  ),
  on(
    ConfigActions.fetchConfigSucceeded,
    (state, { appConfig, localConfig }): ConfigState => ({
      ...state,
      fetchInProgress: false,
      fetchFailed: false,
      appConfig: merge({}, appConfig, localConfig),
    })
  )
);
