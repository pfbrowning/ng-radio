import { BehaviorSubject, Subject } from 'rxjs';
import { CurrentTimeService } from '../services/current-time.service';
import { StreamInfoService } from '../services/stream-info.service';
import { OAuthEvent } from 'angular-oauth2-oidc';

export function createStationLookupServiceSpy(): any {
  const spy = jasmine.createSpyObj('stationLookupServiceSpy', [
    'searchStations',
    'getDeveloperSuggestions',
    'getTopClicked',
    'getTopVoted'
  ]);
  return spy;
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

export function createOAuthServiceSpy(): any {
  const spy = jasmine.createSpyObj('oAuthService', [
      'configure',
      'loadDiscoveryDocumentAndTryLogin',
      'initImplicitFlow',
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
