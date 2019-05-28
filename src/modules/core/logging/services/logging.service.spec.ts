import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@modules/core/config/config.module';
import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { createConfigServiceSpy } from '@modules/core/config/testing/config-spy-factories.spec';
import { LoggingSpyFactories } from '../testing/logging-spy-factories.spec';
import { LoggingModule, LoggingService } from '@modules/core/logging/logging.module';

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

    loggingService = TestBed.get(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
