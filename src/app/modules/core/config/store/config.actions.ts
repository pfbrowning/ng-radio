import { createAction, props } from '@ngrx/store';
import { IAppConfig } from '../models/app-config';

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
  props<{ config: IAppConfig }>()
);

export const configFetchFailed = createAction(
  ConfigActions.ConfigFetchFailed,
  props<{ error: any }>()
);




