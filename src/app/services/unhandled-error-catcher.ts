import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({providedIn: 'root'})
export class UnhandledErrorCatcher implements ErrorHandler {
  constructor(private injector: Injector) {}

  // Pass any unhandled errors to the global error handler
  handleError(error: any) {
    const errorHandler = this.injector.get(ErrorHandlingService);
    errorHandler.handleError(error, 'Unhandled Error Caught');
  }
}