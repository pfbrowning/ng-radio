import { Subject, NEVER, of } from 'rxjs';
import { CurrentTimeService } from '../services/current-time.service';
import { MessageService } from 'primeng/api';
import { WindowService } from '../services/browser-apis/window.service';
import { AppInsightsService } from '../services/logging/app-insights.service';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { SleepTimerService, AudioElementService } from '@core/services';
import { EnvironmentService } from '../services/config/environment.service';
import { ProxyKeyService } from '../services/radio-player/proxy-key.service';
import { PlayerBarFacadeService } from '../store/dispatch-facades/player-bar/player-bar-facade.service';

export const createRadioBrowserServiceSpy = () =>
    jasmine.createSpyObj('radioBrowserService', [
        'searchStations',
        'getTopClicked',
        'getTopVoted',
    ]);

export const createFavoriteStationsServiceSpy = () =>
    jasmine.createSpyObj('favoriteStationsService', ['fetchAll']);

export const createCurrentTimeServiceSpy = () =>
    jasmine.createSpyObj<CurrentTimeService>('currentTimeService', ['unixMs']);

export const createLoggingServiceSpy = () =>
    jasmine.createSpyObj('loggingService', ['logError', 'info', 'logEvent']);

export const createAppInsightsServiceSpy = () =>
    jasmine.createSpyObj<AppInsightsService>('appInsightsService', [
        'initialize',
    ]);

export const createNotificationsServiceSpy = () =>
    jasmine.createSpyObj('notificationsServiceSpy', [
        'info',
        'success',
        'error',
        'warn',
    ]);

export const createMessageServiceSpy = () => {
    const spy = jasmine.createSpyObj<MessageService>('messageServiceSpy', [
        'add',
    ]);
    spy['messageObserver'] = new Subject();
    spy['clearObserver'] = new Subject();
    return spy;
};

export const createWindowServiceSpy = () =>
    jasmine.createSpyObj<WindowService>('windowService', ['getLocationOrigin']);

export const createAuthenticationFacadeSpy = () => {
    const spy = jasmine.createSpyObj<AuthenticationFacadeService>(
        'authenticationFacade',
        ['logoutButtonClicked', 'logInRedirect']
    );
    spy.authenticated$ = NEVER;
    spy.accessToken$ = NEVER;
    return spy;
};

export const createAuthenticationServiceSpy = () =>
    jasmine.createSpyObj<AuthenticationService>('authenticationService', [
        'logIn',
    ]);

export const createSleepTimerServiceSpy = () => {
    const spy = jasmine.createSpyObj<SleepTimerService>('sleepTimerService', [
        'setTimer',
    ]);
    spy.minutesToSleep$ = of(7);
    return spy;
};

export const createAudioElementServiceSpy = () =>
    jasmine.createSpyObj<AudioElementService>('audioElementServiceSpy', [
        'play',
    ]);

export const createEnvironmentServiceSpy = () =>
    jasmine.createSpyObj<EnvironmentService>('environmentService', [
        'isProduction',
    ]);

export const createAudioProxyService = () =>
    jasmine.createSpyObj('audioProxyService', ['play']);

export const createProxyKeyServiceSpy = () =>
    jasmine.createSpyObj<ProxyKeyService>('proxyKeyService', ['fetchNew']);

export const createPlayerBarFacadeSpy = () =>
    jasmine.createSpyObj<PlayerBarFacadeService>('playerBarFacade', [
        'addToFavoritesClicked',
    ]);
