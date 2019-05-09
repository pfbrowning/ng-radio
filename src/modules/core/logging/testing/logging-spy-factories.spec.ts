export class LoggingSpyFactories {  
    public static CreateLoggingServiceSpy(): any {
      return jasmine.createSpyObj('loggingService', ['logException', 'logEvent']);
    }

    public static CreateAppInsightsServiceSpy(): any {
      return jasmine.createSpyObj('appInsightsService', ['trackException', 'trackEvent', 'init']);
    }
}
  