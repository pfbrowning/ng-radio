import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { LoggingService } from './logging/logging.service';
import { NotificationService } from './notifications/notification.service';
import { Severities } from '../models/notifications/severities';
import { LoggerSeverity } from '../models/logging/logger-severity';

@Injectable()
export class UnhandledErrorService implements ErrorHandler {
  constructor(private injector: Injector) {}

  // Pass any unhandled errors to the global error handler
  handleError(error: any) {
    const loggingService = this.injector.get(LoggingService);
    const notificationsService = this.injector.get(NotificationService);
    loggingService.exception(error, LoggerSeverity.Error, { event: 'Unhandled Error Caught' });
    notificationsService.notify(Severities.Error, 'Unhandled Error', error.message);
  }
}
