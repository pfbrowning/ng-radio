import { TestBed } from '@angular/core/testing';
import { SocketIOService } from './socket-io.service';
import { ConfigService } from './config/config.service';
import { ConfigStubService } from '../testing/stubs/config-stub-service.spec';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import { LoggingService } from './logging/logging.service';
import { CoreSpyFactories } from '@core/testing';

describe('SocketIOService', () => {
    let service: SocketIOService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ConfigService, useClass: ConfigStubService },
                {
                    provide: AuthenticationFacadeService,
                    useValue: CoreSpyFactories.createAuthenticationFacadeSpy(),
                },
                {
                    provide: LoggingService,
                    useValue: CoreSpyFactories.createLoggingServiceSpy(),
                },
            ],
        });
        service = TestBed.inject(SocketIOService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
