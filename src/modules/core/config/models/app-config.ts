import { AuthConfig } from 'angular-oauth2-oidc';

export interface IAppConfig {
    metadataApiUrl: string;
    radioBrowserApiUrl: string;
    metadataRefreshInterval: number;
    metadataFetchTimeout: number;
    appInsightsInstrumentationKey: string;
    authConfig: AuthConfig;
}
