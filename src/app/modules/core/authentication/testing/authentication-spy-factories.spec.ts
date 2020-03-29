import { OAuthEvent } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

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

export function createOauthEventListenerServiceSpy(): any {
    return jasmine.createSpyObj('oauthEventListenerService', ['construct']);
}
