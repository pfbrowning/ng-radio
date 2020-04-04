import { AppConfig } from './app-config';

export interface ConfigState {
    initialized: boolean;
    config: AppConfig;
}
