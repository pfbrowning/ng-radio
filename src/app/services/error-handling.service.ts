import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';
import { LoggingService } from './logging.service';
import { SeverityLevel } from '@markpieszak/ng-application-insights';

@Injectable({providedIn: 'root'})
export class ErrorHandlingService {
  constructor(private loggingService: LoggingService) {}

  /* Use a ReplaySubject with a buffer size of 1 so that nothing
  is emitted until an error is provided, but late subscribers are
  still able to access the last provided error. */
  public appError = new ReplaySubject<AppError>(1);

  /** Emits the provided error so that the error window can display it */
  handleError(error: any, comment: string = null) {
    // Next up the error so that the error window component can show it
    this.appError.next(new AppError(error, comment));
    // Log the error to App Insights
    this.loggingService.logException(error, {'comment': comment}, SeverityLevel.Error);
  }
}
