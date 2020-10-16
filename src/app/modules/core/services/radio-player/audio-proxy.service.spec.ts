import { TestBed } from '@angular/core/testing';
import { AudioProxyService } from './audio-proxy.service';
import { ConfigService } from '../config/config.service';
import { AudioElementService } from './audio-element.service';
import { ProxyKeyService } from './proxy-key.service';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { CoreSpyFactories } from '@core/testing';

describe('AudioProxyService', () => {
    let service: AudioProxyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ConfigService, useClass: ConfigStubService },
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
