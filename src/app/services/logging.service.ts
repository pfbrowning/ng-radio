import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import isBlank from 'is-blank';
import { AppInsightsService, SeverityLevel } from '@markpieszak/ng-application-insights';

@Injectable({providedIn: 'root'})
export class LoggingService {
  constructor(private configService: ConfigService, private appInsightsService: AppInsightsService) {
    this.configService.loaded$.subscribe(appConfig => {
      if (!isBlank(appConfig.appInsightsInstrumentationKey)) {
        this.appInsightsService.config.instrumentationKey = appConfig.appInsightsInstrumentationKey;
        this.appInsightsService.init();
      }
    });
  }

  public logException(error: Error, properties: {[name: string]: string; } = null, severity: SeverityLevel = SeverityLevel.Error) {
    this.appInsightsService.trackException(error, null, properties, null, severity);
  }

  public logEvent(eventName: string, properties: {[name: string]: string; } = null, metrics: {[name: string]: number; } = null) {
    this.appInsightsService.trackEvent(eventName, properties, metrics);
  }
}
