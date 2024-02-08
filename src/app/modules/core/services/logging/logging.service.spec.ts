import { TestBed } from '@angular/core/testing';
import { CoreSpyFactories } from '@core/testing';
import { LoggingService, AppInsightsService, ConfigProviderService } from '@core/services';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
        {
          provide: AppInsightsService,
          useValue: CoreSpyFactories.createAppInsightsServiceSpy(),
        },
      ],
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
