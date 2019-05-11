import { Moment } from 'moment';
import { OAuthEvent, OAuthInfoEvent } from 'angular-oauth2-oidc';
import { Observable, empty, ReplaySubject } from 'rxjs';

export class AuthenticationServiceStub {
    private readonly _oAuthEvents = new ReplaySubject<OAuthEvent>(1);
    public authenticated = false;
    public accessTokenExpiration: Moment = null;
    public idTokenExpiration: Moment = null;
    public idTokenExpired = true;
    public accessTokenExpired = true;
    public idTokenExpiresIn: number = null;
    public accessTokenExpiresIn: number = null;
    public idTokenClaims: Object = null;
    public accessTokenClaims: Object = null;
    public silentRefresh(): Promise<OAuthEvent> {
        return Promise.resolve(new OAuthInfoEvent('user_profile_loaded'));
    }
    public initImplicitFlow(): void {}
    public logOut(): void {}
    public get oAuthEvents(): Observable<OAuthEvent> {
        return this._oAuthEvents;
    }
    public emitOAuthEvent(event: OAuthEvent) {
        this._oAuthEvents.next(event);
    }
}
