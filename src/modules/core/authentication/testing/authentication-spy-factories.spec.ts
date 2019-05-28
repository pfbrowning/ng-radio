import { OAuthInfoEvent, OAuthEvent } from 'angular-oauth2-oidc';
import { of, ReplaySubject, Subject } from 'rxjs';

export function createAuthenticationServiceSpy(): any {
    const oAuthEventsSubject = new ReplaySubject<OAuthEvent>(1);
    const spy = jasmine.createSpyObj('authenticationService', [
        'silentRefresh',
        'initImplicitFlow',
        'logOut',
        'tokenProcessed',
        'emitOAuthEvent'
        ]);
    spy.silentRefresh.and.returnValue(Promise.resolve(new OAuthInfoEvent('user_profile_loaded')));
    spy.tokenProcessed.and.returnValue(of(null));
    spy.emitOAuthEvent.and.callFake(oauthEvent => oAuthEventsSubject.next(oauthEvent));
    spy['oAuthEvents'] = oAuthEventsSubject;
    return spy;
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
        'getAccessTokenExpiration',
        'getIdTokenExpiration'
    ]);
    spy['events'] = new Subject<OAuthEvent>();
    spy.loadDiscoveryDocumentAndTryLogin.and.returnValue(Promise.resolve());
    return spy;
}
