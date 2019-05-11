import { Injectable } from '@angular/core';
import { ConfigService } from '@modules/core/config/config.module';
import { AppInsightsService, SeverityLevel } from '@markpieszak/ng-application-insights';
import isBlank from 'is-blank';

/**
 * This is a logging service which is intended to be destination-agnostic.  Currently
 * we're logging to Azure AppInsights and to the console, but this could be changed without
 * affecting the application logic which uses the service.
 */
@Injectable()
export class LoggingService {
  constructor(private configService: ConfigService, private appInsightsService: AppInsightsService) {
    // Once the async app config has loaded
    this.configService.loaded$.subscribe(appConfig => {
      // If an app insights key was provided
      if (!isBlank(appConfig.appInsightsInstrumentationKey)) {
        // Initialize the app insights library
        this.appInsightsService.config.instrumentationKey = appConfig.appInsightsInstrumentationKey;
        this.appInsightsService.init();
      }
    });
  }

  /**
   * Takes an Object and converts it to the dictionary format
   * that the App Insights library expects.
   * @param input Object to convert to a string dictionary
   */
  private static objectToLoggingDictionary(input: Object) {
    const output: {[name: string]: string; } = {};
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
   * Log an Error and any relevant associated information, with the Error severity level
   * @param error A regular JS error
   * @param properties JS object detailing additional information to log
   */
  public logError(error: Error, properties: Object = null) {
    const convertedProperties = LoggingService.objectToLoggingDictionary(properties);
    this.appInsightsService.trackException(error, null, convertedProperties, null, SeverityLevel.Error);
    console.error(error, convertedProperties);
  }

  /**
   * Logs information at the Information severity level
   * @param message String message to identify the log entry
   * @param properties JS object detailing additional information to log
   */
  public logInformation(message: string, properties: Object = null) {
    const convertedProperties = LoggingService.objectToLoggingDictionary(properties);
    this.appInsightsService.trackTrace(message, convertedProperties);
    console.log(message, convertedProperties);
  }
}
