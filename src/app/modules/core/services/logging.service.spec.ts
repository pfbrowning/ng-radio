import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
