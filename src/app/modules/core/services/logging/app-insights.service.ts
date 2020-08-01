import { Injectable } from '@angular/core';
import { ApplicationInsights, SeverityLevel as MicrosoftSeverity, IExceptionTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoggerSeverity as GenericSeverity } from '../../models/logging/logger-severity';
import { ConfigService } from '../config.service';
import { isFalsyOrWhitespace } from '@utilities';

@Injectable({ providedIn: 'root' })
export class AppInsightsService {
  private appInsights: ApplicationInsights;
  private initializedSource = new ReplaySubject<void>(1);
  private loggerReady$ = this.initializedSource.pipe(take(1));
  private severities = new Map<GenericSeverity, MicrosoftSeverity>([
    [ GenericSeverity.Trace, MicrosoftSeverity.Verbose ],
    [ GenericSeverity.Debug, MicrosoftSeverity.Verbose ],
    [ GenericSeverity.Info, MicrosoftSeverity.Information ],
    [ GenericSeverity.Warn, MicrosoftSeverity.Warning ],
    [ GenericSeverity.Error, MicrosoftSeverity.Error ],
    [ GenericSeverity.Fatal, MicrosoftSeverity.Critical ],
  ]);

  constructor(private configService: ConfigService) {
    this.configService.appConfig$.subscribe(config => this.initialize(config.logging.appInsightsInstrumentationKey));
  }

  public initialize(appInsightsInstrumentationKey: string) {
    if (isFalsyOrWhitespace(appInsightsInstrumentationKey)) { return; }
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: appInsightsInstrumentationKey,
        enableAutoRouteTracking: true
      }
    });
    this.appInsights.loadAppInsights();
    this.initializedSource.next();
  }

  /**
   * Logs information to App Insights at the specified severity level
   * @param message Message to log
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  public logTrace(message: string, severityLevel: GenericSeverity, properties: object = null) {
    this.loggerReady$.subscribe(() => {
      const traceTelemetry: ITraceTelemetry = { message, properties, severityLevel: this.severities.get(severityLevel) };
      this.appInsights.trackTrace(traceTelemetry);
    });
  }

  /**
   * Logs an error to App Insights at the specified severity level
   * @param error Error to log.  A regular old JS error.
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  public exception(exception: Error, severityLevel: GenericSeverity, properties: object = null) {
    this.loggerReady$.subscribe(() => {
      const exceptionTelementry: IExceptionTelemetry = { exception, properties, severityLevel: this.severities.get(severityLevel) };
      this.appInsights.trackException(exceptionTelementry);
    });
  }

  public setAuthenticatedUserContext(userId: string) {
    this.loggerReady$.subscribe(() => {
      this.appInsights.context.user.id =  userId;
      this.appInsights.context.user.authenticatedId = userId;
    });
  }
}
