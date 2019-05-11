import { AuthConfig, OAuthEvent } from 'angular-oauth2-oidc';
import { Subject, Observable } from 'rxjs';

export class OAuthServiceStub {
    private _oAuthEvents = new Subject<OAuthEvent>();
    public configure(authConfig: AuthConfig): void {}
    public loadDiscoveryDocumentAndTryLogin(): Promise<void> {
        return Promise.resolve();
    }
    public hasValidIdToken(): boolean {
        return true;
    }
    public hasValidAccessToken(): boolean {
        return true;
    }
    public getIdentityClaims(): object {
        return {};
    }
    public getAccessToken(): string {
        return null;
    }
    public setupAutomaticSilentRefresh(): Promise<void> {
        return Promise.resolve();
    }
    public initImplicitFlow(): void {}
    public logOut(): void {}
    public silentRefresh(): void {}
    public getAccessTokenExpiration(): number {
        return null;
    }
    public getIdTokenExpiration(): number {
        return null;
    }
    public get events(): Observable<OAuthEvent> {
        return this._oAuthEvents;
    }
    public emitOAuthEvent(event: OAuthEvent): void {
        this._oAuthEvents.next(event);
    }
}
