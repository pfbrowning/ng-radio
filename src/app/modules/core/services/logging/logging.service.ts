import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { LoggerSeverity } from '../../models/logging/logger-severity';
import { AppInsightsService } from './app-insights.service';

/** Serilog-inspired provider-agnostic logging service */
@Injectable({ providedIn: 'root' })
export class LoggingService {
  private minLogLevels$ = this.configService.appConfig$.pipe(
    map(config => config.logging.minLogLevels)
  );

  constructor(
    private configService: ConfigService,
    private appInsightsService: AppInsightsService
  ) {}

  /**
   * Log information at the specified severity level
   * @param message Message to log
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  private log(message: string, severityLevel: LoggerSeverity, properties: object = null) {
    this.minLogLevels$.subscribe(minLogLevels => {
      if (minLogLevels.appInsights && severityLevel >= minLogLevels.appInsights) {
        this.appInsightsService.logTrace(message, severityLevel, properties);
      }
      if (minLogLevels.console && severityLevel >= minLogLevels.console) {
        switch (severityLevel) {
          case LoggerSeverity.Fatal:
          case LoggerSeverity.Error:
            console.error(LoggerSeverity[severityLevel], message, properties);
            break;
          case LoggerSeverity.Warn:
            console.warn(LoggerSeverity[severityLevel], message, properties);
            break;
          case LoggerSeverity.Info:
            console.info(LoggerSeverity[severityLevel], message, properties);
            break;
          case LoggerSeverity.Debug:
            console.debug(LoggerSeverity[severityLevel], message, properties);
            break;
          case LoggerSeverity.Trace:
            console.trace(LoggerSeverity[severityLevel], message, properties);
            break;
          default:
            console.log(LoggerSeverity[severityLevel], message, properties);
        }
      }
    });
  }

  /**
   * Log an exception at the specified severity level
   * @param error Error to log.  A regular old JS error.
   * @param severityLevel Severity level to log the message as
   * @param properties JS object mapping extra information to log as key/value pairs
   */
  public exception(exception: Error, severityLevel: LoggerSeverity, properties: object = null) {
    this.minLogLevels$.subscribe(minLogLevels => {
      if (minLogLevels.appInsights && severityLevel >= minLogLevels.appInsights) {
        this.appInsightsService.exception(exception, severityLevel, properties);
      }
      if (minLogLevels.console && severityLevel >= minLogLevels.console) {
        console.error(LoggerSeverity[severityLevel], exception, properties);
      }
    });
  }

  /**
   * Log at the Trace level
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public trace(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Trace, properties);
  }

  /**
   * Log at the Debug level
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public debug(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Debug, properties);
  }

  /**
   * Log at the Warn level
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public warn(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Warn, properties);
  }

  /**
   * Log at the Info level
   * @param message Message to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public info(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Info, properties);
  }

  /**
   * Log at the Error level
   * @param error Error to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public error(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Error, properties);
  }

  /**
   * Log at the Fatal level
   * @param error Error to log
   * @param properties Extra information to log as a set of key/value pairs
   */
  public fatal(message: string, properties: object = null) {
    this.log(message, LoggerSeverity.Fatal, properties);
  }
}
