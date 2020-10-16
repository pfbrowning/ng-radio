import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { AuthenticationEffects } from './authentication.effects';
import { CurrentTimeService } from '@core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState } from '@core';
import { RootState } from '../../models/root-state';
import { hot, cold } from 'jasmine-marbles';
import { CoreSpyFactories } from '@core/testing';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { AppInsightsService } from '../../services/logging/app-insights.service';
import {
    NotificationsService,
    LoggingService,
    ConfigService,
} from '@core/services';
import { AuthenticationActions } from './actions';

describe('AuthenticationEffects', () => {
    let actions$: Observable<any> = null;
    let effects: AuthenticationEffects;
    let store: MockStore<RootState>;
    let configService: ConfigStubService;

    beforeEach(() => {
        configService = new ConfigStubService();

        TestBed.configureTestingModule({
            providers: [
                AuthenticationEffects,
                provideMockActions(() => actions$),
                provideMockStore({ initialState: initialRootState }),
                { provide: ConfigService, useValue: configService },
                {
                    provide: CurrentTimeService,
                    useValue: CoreSpyFactories.createCurrentTimeServiceSpy(),
                },
                {
                    provide: NotificationsService,
                    useValue: CoreSpyFactories.createNotificationsServiceSpy(),
                },
                {
                    provide: LoggingService,
                    useValue: CoreSpyFactories.createLoggingServiceSpy(),
                },
                {
                    provide: AppInsightsService,
                    useValue: CoreSpyFactories.createAppInsightsServiceSpy(),
                },
            ],
        });

        effects = TestBed.inject<AuthenticationEffects>(AuthenticationEffects);
        store = TestBed.inject(MockStore);
    });

    afterEach(() => {
        store.resetSelectors();
    });

    it('should be created', () => {
        expect(effects).toBeTruthy();
    });

    it('should wait until the config is loaded to init the auth logic', () => {
        // Arrange
        // Simulate the standard effects initialization
        actions$ = hot('a', { a: AuthenticationActions.effectsInit() });
        // Simulate waiting 1 frame before the config fetch completes
        configService.appConfig$ = cold('-(a|)', {
            a: { authConfig: { issuer: 'dummyUrl' } },
        });

        // Act & Assert
        // The passage of 1 frame before initializeStart occurs tells us that we're waiting for the config before proceeding
        expect(effects.initAuthOnConfigLoad$).toBeObservable(
            cold('-a', { a: AuthenticationActions.initializeStart() })
        );
    });
});
