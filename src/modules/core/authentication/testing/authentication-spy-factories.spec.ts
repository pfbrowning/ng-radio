import { OAuthInfoEvent, OAuthEvent } from 'angular-oauth2-oidc';
import { of, ReplaySubject } from 'rxjs';

export class AuthenticationSpyFactories {
    public static CreateAuthenticationServiceSpy(): any {
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
  }
