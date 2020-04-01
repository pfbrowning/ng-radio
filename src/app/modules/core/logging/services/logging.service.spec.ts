import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { LoggingModule, LoggingService } from '@logging';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { createAppInsightsServiceSpy } from '../testing/logging-spy-factories.spec';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggingModule
      ],
      providers: [
        provideMockStore({initialState: initialRootState}),
        { provide: AppInsightsService, useValue: createAppInsightsServiceSpy() }
      ]
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
