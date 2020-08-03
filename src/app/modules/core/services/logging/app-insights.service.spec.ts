import { TestBed } from '@angular/core/testing';
import { AppInsightsService } from './app-insights.service';
import { ConfigService } from '../config/config.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { of } from 'rxjs';

describe('AppInsightsService', () => {
  let service: AppInsightsService;
  let configService: ConfigStubService;


  beforeEach(() => {
    configService = new ConfigStubService();
    configService.appConfig$ = of({ logging: { appInsightsInstrumentationKey: null } } as any);

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: configService }
      ]
    });
    service = TestBed.inject(AppInsightsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
