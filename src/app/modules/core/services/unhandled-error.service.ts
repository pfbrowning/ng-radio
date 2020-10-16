import { Injectable, Injector, ErrorHandler } from '@angular/core'
import { LoggingService } from './logging/logging.service'
import { NotificationsService } from './notifications/notifications.service'
import { LoggerSeverity } from '../models/logging/logger-severity'

@Injectable()
export class UnhandledErrorService implements ErrorHandler {
    constructor(private injector: Injector) {}

    // Pass any unhandled errors to the global error handler
    handleError(error: any) {
        const loggingService = this.injector.get(LoggingService)
        const notificationsService = this.injector.get(NotificationsService)
        loggingService.exception(error, LoggerSeverity.Error, {
            event: 'Unhandled Error Caught',
        })
        notificationsService.error('Unhandled Error', error.message)
    }
}
