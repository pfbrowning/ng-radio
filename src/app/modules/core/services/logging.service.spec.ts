import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { ConfigService } from './config.service';
import { ConfigStubService } from '../testing/stubs/config-stub-service.spec';

describe('LoggingService', () => {
  let loggingService: LoggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigStubService }
      ]
    });

    loggingService = TestBed.inject(LoggingService);
  });

  it('should be created', () => {
    expect(loggingService).toBeTruthy();
  });
});
