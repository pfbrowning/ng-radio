import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';

@Injectable({providedIn: 'root'})
export class ErrorHandlingService {
  /* Use a ReplaySubject with a buffer size of 1 so that nothing
  is emitted until an error is provided, but late subscribers are
  still able to access the last provided error. */
  public appError = new ReplaySubject<AppError>(1);

  /** Emits the provided error so that the error window can display it */
  handleError(error: any, comment: string = null) {
    this.appError.next(new AppError(error, comment));
  }
}
