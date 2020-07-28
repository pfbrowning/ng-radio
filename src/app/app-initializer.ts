import { ConfigService, AppInsightsService } from '@core';

export function appInitializer(configService: ConfigService, appInsightsService: AppInsightsService) {
    return () => configService.appConfig$.subscribe(config => {
        appInsightsService.initialize(config.logging.appInsightsInstrumentationKey);
    });
}
