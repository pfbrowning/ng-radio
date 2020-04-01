import { LoggingService } from '../logging.module';
import { AppInsightsService } from '@markpieszak/ng-application-insights';

export function createLoggingServiceSpy(): jasmine.SpyObj<LoggingService> {
  return jasmine.createSpyObj('loggingService', ['logError', 'logInformation', 'logEvent']);
}

export function createAppInsightsServiceSpy(): jasmine.SpyObj<AppInsightsService> {
  return jasmine.createSpyObj('appInsightsService', ['trackException', 'trackEvent', 'init']);
}
