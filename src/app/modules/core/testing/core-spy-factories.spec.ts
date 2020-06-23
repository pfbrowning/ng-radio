import { BehaviorSubject, Subject, of } from 'rxjs';
import { CurrentTimeService } from '../services/current-time.service';
import { StreamInfoService } from '../services/stream-info.service';
import { OAuthEvent, OAuthService } from 'angular-oauth2-oidc';
import { LoggingService } from '../services/logging.service';
import { NotificationService } from '../services/notification.service';
import { MessageService } from 'primeng/api';
import { StreamPreprocessorService } from '../services/preprocessing/stream-preprocessor.service';
import { StreamValidatorService } from '../services/preprocessing/stream-validator.service';
import { RadioBrowserService } from '../services/radio-browser.service';

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
  return jasmine.createSpyObj('currentTimeService', ['unix']);
}

export function createStreamInfoServiceSpy(): jasmine.SpyObj<StreamInfoService> {
  return jasmine.createSpyObj('streamInfoService', ['getMetadata']);
}

export function createOAuthServiceSpy(): jasmine.SpyObj<OAuthService> {
  const spy = jasmine.createSpyObj('oAuthService', [
      'configure',
      'loadDiscoveryDocumentAndTryLogin',
      'initCodeFlow',
      'logOut',
      'setupAutomaticSilentRefresh',
      'silentRefresh',
      'hasValidIdToken',
      'hasValidAccessToken',
      'getIdentityClaims',
      'getAccessToken',
      'getAccessTokenExpiration',
      'getIdTokenExpiration'
  ]);
  spy['events'] = new Subject<OAuthEvent>();
  spy.loadDiscoveryDocumentAndTryLogin.and.returnValue(Promise.resolve());
  return spy;
}

export function createConfigServiceSpy(): any {
  const spy = jasmine.createSpyObj('configService', ['initialize']);
  const appConfig = {
    'metadataApiUrl': 'test.com',
    'radioBrowserApiUrl': 'test.com',
    'metadataRefreshInterval': 15000,
    'metadataFetchTimeout': 10
  };
  spy['appConfig'] = appConfig;
  spy['appConfig$'] = of(appConfig);
  spy['loaded$'] = new Subject();
  spy['initialized'] = true;
  return spy;
}

export function createLoggingServiceSpy(): jasmine.SpyObj<LoggingService> {
  return jasmine.createSpyObj('loggingService', ['logError', 'logInformation', 'logEvent']);
}


export function createNotificationServiceSpy(): jasmine.SpyObj<NotificationService> {
  return jasmine.createSpyObj('notificationServiceSpy', ['notify']);
}

export function createMessageServiceSpy(): jasmine.SpyObj<MessageService> {
  const spy = jasmine.createSpyObj('messageServiceSpy', ['add']);
  spy['messageObserver'] = new Subject();
  spy['clearObserver'] = new Subject();
  return spy;
}

export function createStreamPreprocessorServiceSpy(): jasmine.SpyObj<StreamPreprocessorService> {
  return jasmine.createSpyObj('streamPreprocessorService', ['preprocess']);
}

export function createStreamValidatorServiceSpy(): jasmine.SpyObj<StreamValidatorService> {
  return jasmine.createSpyObj('streamValidatorService', [ 'validate' ]);
}
