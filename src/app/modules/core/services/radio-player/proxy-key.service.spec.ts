import { TestBed } from '@angular/core/testing';
import { ProxyKeyService } from './proxy-key.service';
import { ConfigService } from '../config/config.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigProviderService } from '../config/config-provider.service';
import { CoreSpyFactories } from '@core/testing';

describe('ProxyKeyService', () => {
  let service: ProxyKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
      ],
    });
    service = TestBed.inject(ProxyKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
