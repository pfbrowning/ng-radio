import { UserManagerSettings } from 'oidc-client';

export interface AppConfig {
    radioBrowserApiUrl: string;
    radioBrowserSearchResultsLimit: number;
    favoriteStationsApiUrl: string;
    imageProxyUrl: string;
    radioProxyUrl: string;
    refreshIntervalShort: number;
    refreshIntervalLong: number;
    metadataFetchTimeout: number;
    authConfig: {
        userManager: UserManagerSettings;
        logoutUrl: string;
    };
    logging: {
        appInsightsInstrumentationKey: string;
        minLogLevels: {
            console: number;
            appInsights: number;
        }
    };
}
