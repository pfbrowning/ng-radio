import { TestBed } from '@angular/core/testing';
import { ProxyKeyService } from './proxy-key.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigProviderService } from '../config/config-provider.service';
import { CoreSpyFactories } from '@core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProxyKeyService', () => {
  let service: ProxyKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(ProxyKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
