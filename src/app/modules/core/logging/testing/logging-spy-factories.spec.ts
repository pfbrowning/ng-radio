export class LoggingSpyFactories {
    public static CreateLoggingServiceSpy(): any {
      return jasmine.createSpyObj('loggingService', ['logError', 'logInformation', 'logEvent']);
    }

    public static CreateAppInsightsServiceSpy(): any {
      return jasmine.createSpyObj('appInsightsService', ['trackException', 'trackEvent', 'init']);
    }
}

