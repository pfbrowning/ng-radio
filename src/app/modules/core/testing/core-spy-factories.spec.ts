import { BehaviorSubject, Subject, NEVER, of } from 'rxjs';
import { CurrentTimeService } from '../services/current-time.service';
import { MessageService } from 'primeng/api';
import { WindowService } from '../services/browser-apis/window.service';
import { AppInsightsService } from '../services/logging/app-insights.service';
import { AuthenticationFacadeService } from '../store/authentication/authentication-facade.service';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { NotificationsService, RadioBrowserService, LoggingService, SleepTimerService, AudioElementService } from '@core/services';
import { EnvironmentService } from '../services/config/environment.service';
import { ProxyKeyService } from '../services/radio-player/proxy-key.service';
import { PlayerBarFacadeService } from '../store/dispatch-facades/player-bar/player-bar-facade.service';

export function createRadioBrowserServiceSpy(): jasmine.SpyObj<RadioBrowserService> {
  return jasmine.createSpyObj('radioBrowserService', [
    'searchStations',
    'getTopClicked',
    'getTopVoted'
  ]);
}

export function createFavoriteStationsServiceSpy(): any {
  return jasmine.createSpyObj('favoriteStationsService', ['fetchAll']);
}

export function createKeepAwakeServiceSpy(): any {
  const spy = jasmine.createSpyObj('keepAwakeServiceSpy', ['enable', 'disable']);
  spy['enabled$'] = new BehaviorSubject<boolean>(false);
  return spy;
}

export function createCurrentTimeServiceSpy(): jasmine.SpyObj<CurrentTimeService> {
  return jasmine.createSpyObj('currentTimeService', ['unixMs']);
}

export function createLoggingServiceSpy(): jasmine.SpyObj<LoggingService> {
  return jasmine.createSpyObj('loggingService', ['logError', 'info', 'logEvent']);
}

export function createAppInsightsServiceSpy(): jasmine.SpyObj<AppInsightsService> {
  return jasmine.createSpyObj('appInsightsService', ['initialize']);
}

export function createNotificationsServiceSpy(): jasmine.SpyObj<NotificationsService> {
  return jasmine.createSpyObj('notificationsServiceSpy', ['info', 'success', 'error', 'warn']);
}

export function createMessageServiceSpy(): jasmine.SpyObj<MessageService> {
  const spy = jasmine.createSpyObj('messageServiceSpy', ['add']);
  spy['messageObserver'] = new Subject();
  spy['clearObserver'] = new Subject();
  return spy;
}

export function createWindowServiceSpy(): jasmine.SpyObj<WindowService> {
  return jasmine.createSpyObj('windowService', [ 'getLocationOrigin' ]);
}

export function createAuthenticationFacadeSpy(): jasmine.SpyObj<AuthenticationFacadeService> {
  const spy = jasmine.createSpyObj('authenticationFacade', ['logOut', 'logInRedirect']);
  spy.authenticated$ = NEVER;
  spy.accessToken$ = NEVER;
  return spy;
}

export function createAuthenticationServiceSpy(): jasmine.SpyObj<AuthenticationService> {
  return jasmine.createSpyObj('authenticationService', [ 'logIn' ]);
}

export function createSleepTimerServiceSpy(): jasmine.SpyObj<SleepTimerService> {
  const spy = jasmine.createSpyObj('sleepTimerService', [ 'set' ]);
  spy.minutesToSleep$ = of(7);
  return spy;
}

export function createAudioElementServiceSpy(): jasmine.SpyObj<AudioElementService> {
  return jasmine.createSpyObj('audioElementServiceSpy', ['play']);
}

export function createEnvironmentServiceSpy(): jasmine.SpyObj<EnvironmentService> {
  return jasmine.createSpyObj('environmentService', [ 'isProduction' ]);
}

export const createAudioProxyService = () => jasmine.createSpyObj('audioProxyService', [ 'play' ]);

export const createProxyKeyServiceSpy = () => jasmine.createSpyObj<ProxyKeyService>('proxyKeyService', [ 'fetchNew' ]);

export const createPlayerBarFacadeSpy = () => jasmine.createSpyObj<PlayerBarFacadeService>('playerBarFacade', [ 'addToFavoritesClicked' ]);
