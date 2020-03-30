import { IAppConfig } from './app-config';

export interface ConfigState {
    initialized: boolean;
    config: IAppConfig;
}
