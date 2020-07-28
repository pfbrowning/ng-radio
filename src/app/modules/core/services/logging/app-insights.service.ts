import { Injectable } from '@angular/core';
import { ApplicationInsights, SeverityLevel as MicrosoftSeverity, IExceptionTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';
import { ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoggerSeverity as BrowningSeverity } from '../../models/logging/logger-severity';

@Injectable({ providedIn: 'root' })
export class AppInsightsService {
  private appInsights: ApplicationInsights;
  private initializedSource = new ReplaySubject<void>(1);
  private loggerReady$ = this.initializedSource.pipe(take(1));
  private severities = new Map<BrowningSeverity, MicrosoftSeverity>([
    [ BrowningSeverity.Trace, MicrosoftSeverity.Verbose ],
    [ BrowningSeverity.Debug, MicrosoftSeverity.Verbose ],
    [ BrowningSeverity.Info, MicrosoftSeverity.Information ],
    [ BrowningSeverity.Warn, MicrosoftSeverity.Warning ],
    [ BrowningSeverity.Error, MicrosoftSeverity.Error ],
    [ BrowningSeverity.Fatal, MicrosoftSeverity.Critical ],
  ]);

  public initialize(appInsightsInstrumentationKey: string) {
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
  public logTrace(message: string, severityLevel: BrowningSeverity, properties: object = null) {
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
  public exception(exception: Error, severityLevel: BrowningSeverity, properties: object = null) {
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
