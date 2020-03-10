import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handling.service';
import { Subscription } from 'rxjs';
import { AppError } from '../models/app-error';
import { LoggingSpyFactories } from '@modules/core/logging/testing/logging-spy-factories.spec';
import { LoggingService } from '@modules/core/logging/logging.module';

describe('ErrorHandlingService', () => {
  let errorHandlingService: ErrorHandlingService;
  let appErrorSpy: any;
  let appErrorSub: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlingService,
        { provide: LoggingService, useValue: LoggingSpyFactories.CreateLoggingServiceSpy() }
      ]
    });

    errorHandlingService = TestBed.inject(ErrorHandlingService);

    appErrorSpy = jasmine.createSpyObj('appError', ['emit', 'error', 'complete']);
  });

  it('should be created', () => {
    expect(errorHandlingService).toBeTruthy();
  });

  it('should properly emit a new error on each call to handleError', () => {
    // Subscribe to appError and pass next / error / complete to spies
    appErrorSub = errorHandlingService.appError.subscribe(
      appError => appErrorSpy.emit(appError),
      error => appErrorSpy.error(error),
      () => appErrorSpy.complete()
    );

    // After initial subscription check that nothing has been emitted yet
    expect(appErrorSpy.emit).not.toHaveBeenCalled();

    // handle an error and check that it was emitted properly
    errorHandlingService.handleError('test error message', 'test error comment');
    expect(appErrorSpy.emit).toHaveBeenCalledTimes(1);
    expect(appErrorSpy.emit.calls.mostRecent().args).toEqual([new AppError('test error message', 'test error comment')]);

    // handle a second error and check that it was emitted properly
    errorHandlingService.handleError('error 2', 'comment 2');
    expect(appErrorSpy.emit).toHaveBeenCalledTimes(2);
    expect(appErrorSpy.emit.calls.mostRecent().args).toEqual([new AppError('error 2', 'comment 2')]);

    // Unsubscribe and use our spies to check that the emissions of the subscription match our expectations.
    appErrorSub.unsubscribe();
    expect(appErrorSub.closed).toBe(true);
    expect(appErrorSpy.emit).toHaveBeenCalledTimes(2);
    expect(appErrorSpy.complete).not.toHaveBeenCalled();
    expect(appErrorSpy.error).not.toHaveBeenCalled();
  });

  it('should emit the previous error to a late subscriber', () => {
    // handle an error before anybody has subscribed to the appError
    errorHandlingService.handleError('test error', 'test comment');

    // Subscribe to appError
    appErrorSub = errorHandlingService.appError.subscribe(
      appError => appErrorSpy.emit(appError),
      error => appErrorSpy.error(error),
      () => appErrorSpy.complete()
    );

    // Expect that the error was emitted immediately upon subscription
    expect(appErrorSpy.emit).toHaveBeenCalledTimes(1);
    expect(appErrorSpy.emit.calls.mostRecent().args).toEqual([new AppError('test error', 'test comment')]);

    // Unsubscribe and check that nothing unsuspected happened.
    appErrorSub.unsubscribe();
    expect(appErrorSub.closed).toBe(true);
    expect(appErrorSpy.emit).toHaveBeenCalledTimes(1);
    expect(appErrorSpy.complete).not.toHaveBeenCalled();
    expect(appErrorSpy.error).not.toHaveBeenCalled();
  });
});
