import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
    metadataApiUrl: string;
    radioBrowserApiUrl: string;
    favoriteStationsApiUrl: string;
    corsProxyUrl: string;
    currentStationRefreshInterval: number;
    listedStationRefreshInterval: number;
    metadataFetchTimeout: number;
    appInsightsInstrumentationKey: string;
    authConfig: AuthConfig;
}
