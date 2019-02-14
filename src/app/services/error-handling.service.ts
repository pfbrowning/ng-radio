import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AppError } from '../models/app-error';
import { MessageService } from 'primeng/api';

@Injectable({providedIn: 'root'})
export class ErrorHandlingService {
  constructor(private messageService: MessageService) {}

  /* Use a ReplaySubject with a buffer size of 1 so that nothing
  is emitted until an error is provided, but late subscribers are
  still able to access the last provided error. */
  public appError = new ReplaySubject<AppError>(1);

  handleError(error: any, comment: string = null, fatal: boolean = false) {
    // If the error is noted as fatal, then emit it as appError to lock down the app with a modal
    if(fatal) {
      this.appError.next(new AppError(error, comment));
    }
    // For non-fatal errors, just use a toaster notification
    else {
      this.messageService.add({severity: 'error', summary: comment || 'Error', detail: error.message});
    }
  }
}
