import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from './app-insights.service';
import { of } from 'rxjs';
import { ConfigProviderService } from '../config/config-provider.service';
import { CoreSpyFactories } from '@core/testing';

describe('AppInsightsService', () => {
  let service: AppInsightsService;
  let configProvider: jasmine.SpyObj<ConfigProviderService>;

  beforeEach(() => {
    configProvider = CoreSpyFactories.createConfigProviderSpy();
    configProvider.getConfigOnceLoaded.and.returnValue(
      of({ logging: { appInsightsInstrumentationKey: null } } as any)
    );

    TestBed.configureTestingModule({
      providers: [{ provide: ConfigProviderService, useValue: configProvider }],
    });
    service = TestBed.inject(AppInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
