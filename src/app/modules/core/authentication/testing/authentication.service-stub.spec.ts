import { Moment } from 'moment';
import { OAuthEvent, OAuthInfoEvent } from 'angular-oauth2-oidc';
import { Observable, ReplaySubject } from 'rxjs';

export class AuthenticationServiceStub {
    public get oAuthEvents(): Observable<OAuthEvent> {
        return this._oAuthEvents;
    }
    private readonly _oAuthEvents = new ReplaySubject<OAuthEvent>(1);
    public readonly tokenProcessed$ = new ReplaySubject<void>(1);
    public authenticated = false;
    public accessTokenExpiration: Moment = null;
    public idTokenExpiration: Moment = null;
    public idTokenExpired = true;
    public accessTokenExpired = true;
    public idTokenExpiresIn: number = null;
    public accessTokenExpiresIn: number = null;
    public idTokenClaims: Object = null;
    public accessTokenClaims: Object = null;
    public initImplicitFlowSpy = spyOn(AuthenticationServiceStub.prototype, 'initImplicitFlow');
    public silentRefresh(): Promise<OAuthEvent> {
        return Promise.resolve(new OAuthInfoEvent('user_profile_loaded'));
    }
    public initImplicitFlow(): void {}
    public logOut(): void {}
    public emitOAuthEvent(event: OAuthEvent) {
        this._oAuthEvents.next(event);
    }
}
