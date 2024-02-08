import { AppConfig } from '../../models/config/app-config';

export interface ConfigState {
  appConfig: AppConfig;
  fetchInProgress: boolean;
  fetchFailed: boolean;
}
