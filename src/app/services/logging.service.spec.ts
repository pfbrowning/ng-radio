import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { ConfigService } from '@modules/config/config.module';
import { SpyFactories } from '../testing/spy-factories.spec';
import { AppInsightsService } from '@markpieszak/ng-application-insights';
import { ConfigSpyFactories } from '@modules/config/testing/config-spy-factories.spec';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: ConfigSpyFactories.CreateConfigServiceSpy() },
        { provide: AppInsightsService, useValue: SpyFactories.CreateAppInsightsServiceSpy() }
      ]
    });

    loggingService = TestBed.get(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
