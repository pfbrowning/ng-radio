import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationInsightsModule, AppInsightsService } from '@markpieszak/ng-application-insights';
import { LoggingService } from './services/logging.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ApplicationInsightsModule.forRoot({
      instrumentationKeySetLater: true
    }),
  ],
  providers: [
    AppInsightsService,
    LoggingService
  ]
})
export class LoggingModule { }

export { LoggingService };
