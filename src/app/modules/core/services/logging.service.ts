import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState } from '@core';
import { selectConfig } from '@core/store/config/selectors';
import { filter, take } from 'rxjs/operators';
import { ApplicationInsights, SeverityLevel, IExceptionTelemetry, ITraceTelemetry } from '@microsoft/applicationinsights-web';
import { ReplaySubject } from 'rxjs';
import isBlank from 'is-blank';

/**
 * This service handles the responsibility of logging errors, events, and
 * information to Azure Application Insights.
 */
@Injectable({providedIn: 'root'})
export class LoggingService {
  constructor(private store: Store<RootState>) {
    // Once the app config has loaded
    this.store.pipe(select(selectConfig), filter(config => config != null), take(1)).subscribe(config => {
      // If an app insights key was provided
      if (!isBlank(config.appInsightsInstrumentationKey)) {
        this.appInsights = new ApplicationInsights({
          config: {
            instrumentationKey: config.appInsightsInstrumentationKey,
            enableAutoRouteTracking: true
          }
        });
        this.appInsights.loadAppInsights();
        this.initialized.next();
      }
    });
  }

  private appInsights: ApplicationInsights;
  private initialized = new ReplaySubject<void>(1);

  /**
   * Takes an Object and converts it to the dictionary format
   * that the App Insights library expects.
   * @param input Object to convert to a string dictionary
   */
  private static objectToLoggingDictionary(input: Object) {
    const output: { [name: string]: string; } = {};
    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        const value = input[key];
        switch (typeof value) {
          case 'boolean':
          case 'number':
          case 'string':
            output[key] = value.toString();
            break;
          case 'object':
            output[key] = JSON.stringify(value);
            break;
        }
      }
    }
    return output;
  }

  /**
   * Logs information to App Insights at the specified severity level once app insights has been initialized
   * @param message Message to log
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  private logTrace(message: string, severityLevel: SeverityLevel, properties: object = null) {
    this.initialized.pipe(take(1)).subscribe(() => {
      const traceTelemetry: ITraceTelemetry = {
        message,
        severityLevel,
        properties: LoggingService.objectToLoggingDictionary(properties)
      };
      this.appInsights.trackTrace(traceTelemetry);
    });
  }

  /**
   * Logs an error to App Insights at the specified severity level once app insights has been initialized
   * @param error Error to log.  A regular old JS error.
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  private logException(error: Error, severityLevel: SeverityLevel, properties: Object = null) {
    this.initialized.pipe(take(1)).subscribe(() => {
      const exceptionTelementry: IExceptionTelemetry = {
        exception: error,
        severityLevel,
        properties: LoggingService.objectToLoggingDictionary(properties)
      };
      this.appInsights.trackException(exceptionTelementry);
    });
  }

  public setAuthenticatedUserContext(userId: string, accountId: string) {
    this.initialized.pipe(take(1)).subscribe(() => {
      this.appInsights.setAuthenticatedUserContext(userId, accountId);
    });
  }

  /**
   * Provider-agnostic logging entry point for verbose-level logging
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public logVerbose(message: string, properties: object = null) {
    this.logTrace(message, SeverityLevel.Verbose, properties);
  }

  /**
   * Provider-agnostic logging entry point for warn-level logging
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public logWarning(message: string, properties: object = null) {
    this.logTrace(message, SeverityLevel.Warning, properties);
  }

  /**
   * Provider-agnostic logging entry point for information-level logging
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public logInformation(message: string, properties: object = null) {
    this.logTrace(message, SeverityLevel.Information, properties);
  }

  /**
   * Provider-agnostic logging entry point for error-level logging
   * @param error Error to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public logError(error: Error, properties: Object = null) {
    this.logException(error, SeverityLevel.Error, properties);
  }

  /**
   * Provider-agnostic logging entry point for critical-level logging
   * @param error Error to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public logCritical(error: Error, properties: Object = null) {
    this.logException(error, SeverityLevel.Critical, properties);
  }
}
