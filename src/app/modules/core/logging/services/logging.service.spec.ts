import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@config';
import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { createConfigServiceSpy } from '@config/testing';
import { LoggingSpyFactories } from '../testing/logging-spy-factories.spec';
import { LoggingModule, LoggingService } from '@logging';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggingModule
      ],
      providers: [
        { provide: ConfigService, useValue: createConfigServiceSpy() },
        { provide: AppInsightsService, useValue: LoggingSpyFactories.CreateAppInsightsServiceSpy() }
      ]
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
