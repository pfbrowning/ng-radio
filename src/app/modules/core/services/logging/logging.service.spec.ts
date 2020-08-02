import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../config.service';
import { ConfigStubService } from '@core/testing';
import { CoreSpyFactories } from '@core/testing';
import { LoggingService, AppInsightsService } from '@core/services';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigStubService },
        { provide: AppInsightsService, useValue: CoreSpyFactories.createAppInsightsServiceSpy() }
      ]
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
