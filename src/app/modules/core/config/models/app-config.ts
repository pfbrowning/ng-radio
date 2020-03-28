import { AuthConfig } from 'angular-oauth2-oidc';

export interface IAppConfig {
    metadataApiUrl: string;
    radioBrowserApiUrl: string;
    favoriteStationsApiUrl: string;
    metadataRefreshInterval: number;
    metadataFetchTimeout: number;
    appInsightsInstrumentationKey: string;
    authConfig: AuthConfig;
}
