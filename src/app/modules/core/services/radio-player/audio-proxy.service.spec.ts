import { TestBed } from '@angular/core/testing';
import { AudioProxyService } from './audio-proxy.service';
import { AudioElementService } from './audio-element.service';
import { ProxyKeyService } from './proxy-key.service';
import { CoreSpyFactories } from '@core/testing';
import { ConfigProviderService } from '../config/config-provider.service';

describe('AudioProxyService', () => {
  let service: AudioProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigProviderService, useValue: CoreSpyFactories.createConfigProviderSpy() },
        {
          provide: AudioElementService,
          useValue: CoreSpyFactories.createAudioElementServiceSpy(),
        },
        {
          provide: ProxyKeyService,
          useValue: CoreSpyFactories.createProxyKeyServiceSpy(),
        },
      ],
    });
    service = TestBed.inject(AudioProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
