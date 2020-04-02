import { TestBed } from '@angular/core/testing';
import { LoggingModule, LoggingService } from '@logging';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggingModule
      ],
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
