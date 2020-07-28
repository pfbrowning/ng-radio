import { AuthConfig } from 'angular-oauth2-oidc';

export interface AppConfig {
    metadataApiUrl: string;
    radioBrowserApiUrl: string;
    radioBrowserSearchResultsLimit: number;
    favoriteStationsApiUrl: string;
    corsProxyUrl: string;
    refreshIntervalShort: number;
    refreshIntervalLong: number;
    metadataFetchTimeout: number;
    authConfig: AuthConfig;
    logging: {
        appInsightsInstrumentationKey: string;
        minLogLevels: {
            console: number;
            appInsights: number;
        }

    };
}
