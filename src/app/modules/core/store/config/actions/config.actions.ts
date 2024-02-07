import { createAction, props } from '@ngrx/store';
import { AppConfig } from '../../../models/config/app-config';

enum ConfigActions {
  EffectsInit = '[Config] Effects Init',
  FetchConfigStart = '[Config] Fetch Config Start',
  FetchConfigSucceeded = '[Config] Fetch Config Succeeded',
  FetchConfigFailed = '[Config] Fetch Config Failed',
}

export const effectsInit = createAction(ConfigActions.EffectsInit);

export const fetchConfigStart = createAction(ConfigActions.FetchConfigStart);

export const fetchConfigSucceeded = createAction(
  ConfigActions.FetchConfigSucceeded,
  props<{ appConfig: AppConfig; localConfig: AppConfig }>()
);

export const fetchConfigFailed = createAction(
  ConfigActions.FetchConfigFailed,
  props<{ error: any }>()
);
