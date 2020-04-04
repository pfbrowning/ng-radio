import { createAction, props } from '@ngrx/store';
import { AppConfig } from '../../models/config/app-config';

export enum ConfigActions {
  EffectsInit = '[Config] Effects Init',
  ConfigFetchStart = '[Config] Fetch Start',
  ConfigFetchSucceeded = '[Config] Fetch Succeeded',
  ConfigFetchFailed = '[Config] Fetch Failed',
}

export const effectsInit = createAction(
  ConfigActions.EffectsInit
);

export const configFetchStart = createAction(
  ConfigActions.ConfigFetchStart
);

export const configFetchSucceeded = createAction(
  ConfigActions.ConfigFetchSucceeded,
  props<{ config: AppConfig }>()
);

export const configFetchFailed = createAction(
  ConfigActions.ConfigFetchFailed,
  props<{ error: any }>()
);




