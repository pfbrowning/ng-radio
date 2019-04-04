import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { ConfigService } from './config.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import { AppInsightsService } from '@markpieszak/ng-application-insights';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: SpyFactories.CreateConfigServiceSpy() },
        { provide: AppInsightsService, useValue: SpyFactories.CreateAppInsightsServiceSpy() }
      ]
    });

    loggingService = TestBed.get(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
