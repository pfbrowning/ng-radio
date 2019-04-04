import { TestBed } from '@angular/core/testing';

import { ErrorHandlingService } from './error-handling.service';
import { AppError } from '../models/app-error';
import { LoggingService } from './logging.service';
import { SpyFactories } from '../testing/spy-factories.spec';

describe('ErrorHandlingService', () => {
  let errorHandlingService: ErrorHandlingService;
  let loggingServiceSpy: jasmine.SpyObj<LoggingService>;
  let appErrorSubSpy: any;

  beforeEach(() => {
    loggingServiceSpy = SpyFactories.CreateLoggingServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        { provide: LoggingService, useValue: loggingServiceSpy }
      ]
    });

    errorHandlingService = TestBed.get(ErrorHandlingService);
    appErrorSubSpy = jasmine.createSpyObj('appError', ['emit', 'error', 'complete']);
  });

  it('should be created', () => {
    expect(errorHandlingService).toBeTruthy();
  });

  it('should properly handle handleError', () => {
    const dummyError = new Error('Test Error');
    // Spy on the subscription itself so that we know exactly what it emits
    const appErrorSub = errorHandlingService.appError.subscribe(
      next => appErrorSubSpy.emit(next),
      error => appErrorSubSpy.error(error),
      () => appErrorSubSpy.complete()
    );

    /* At first the appError ReplaySubject should not have emitted
    anything and logException should not have been called. */
    expect(appErrorSubSpy.emit).not.toHaveBeenCalled();
    expect(loggingServiceSpy.logException).not.toHaveBeenCalled();

    // Pass an error to handleError
    errorHandlingService.handleError(dummyError, 'Error Comment');

    /* Expect that a single corresponding AppError object was
    emitted from the appError ReplaySubject. */
    expect(appErrorSubSpy.emit).toHaveBeenCalledTimes(1);
    expect(appErrorSubSpy.emit.calls.mostRecent().args).toEqual([new AppError(dummyError, 'Error Comment')]);

    // The appError ReplaySubject should not error out or complete at any point in the process
    expect(appErrorSubSpy.error).not.toHaveBeenCalled();
    expect(appErrorSubSpy.complete).not.toHaveBeenCalled();

    expect(loggingServiceSpy.logException).toHaveBeenCalledTimes(1);
  });
});
