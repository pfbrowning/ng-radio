import { TestBed } from '@angular/core/testing';
import { RadioPlayerService } from './radio-player.service';
import { ConfigService } from '../config/config.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { AudioElementService } from './audio-element.service';
import { CoreSpyFactories } from '@core/testing';
import { ProxyKeyService } from './proxy-key.service';

describe('RadioPlayerService', () => {
  let service: RadioPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useClass: ConfigStubService },
        { provide: AudioElementService, useValue: CoreSpyFactories.createAudioElementServiceSpy() },
        { provide: ProxyKeyService, useValue: CoreSpyFactories.createProxyKeyServiceSpy() }
      ]
    });
    service = TestBed.inject(RadioPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
