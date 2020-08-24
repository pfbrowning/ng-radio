import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserManager, User, UserManagerSettings } from 'oidc-client';
import { Observable, Subject, from } from 'rxjs';
import { WindowService } from '../browser-apis/window.service';
import { TokenReceivedResult } from '../../models/authentication/token-received-result';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private userManager: UserManager;

  private userLoadedSource = new Subject<User>();
  private accessTokenExpiringSource = new Subject<void>();
  private accessTokenExpiredSource = new Subject<void>();
  private silentRefreshErrorSource = new Subject<any>();

  public accessTokenExpiring$ = this.accessTokenExpiringSource.asObservable();
  public accessTokenExpired$ = this.accessTokenExpiredSource.asObservable();
  public silentRefreshError$ = this.silentRefreshErrorSource.asObservable();
  public silentRefreshSucceeded$ = this.userLoadedSource.pipe(
    map(user => this.userToTokenReceivedResult(user))
  );

  constructor(private windowService: WindowService) { }

  public initialize(config: UserManagerSettings): Observable<TokenReceivedResult> {
    this.userManager = new UserManager(config);
    this.registerEvents();
    return from(this.userManager.getUser()).pipe(
      map(user => this.userToTokenReceivedResult(user))
    );
  }

  private userToTokenReceivedResult(user: User): TokenReceivedResult {
    const authenticated = user != null && !isFalsyOrWhitespace(user.access_token);
    return {
      email: user.profile.email,
      accessToken: user.access_token,
      authenticated
    };
  }

  private registerEvents() {
    this.userManager.events.addUserLoaded(user => this.userLoadedSource.next(user));
    this.userManager.events.addAccessTokenExpiring(() => this.accessTokenExpiringSource.next());
    this.userManager.events.addAccessTokenExpired(() => this.accessTokenExpiredSource.next());
    this.userManager.events.addSilentRenewError(error =>  this.silentRefreshErrorSource.next());
  }

  public logOut(customLogoutUrl: string): void {
    this.userManager.removeUser();
    /* If a custom logout url was provided, then navigate directly.  This is necessary
    for Auth0 or any other providers who don't support the standard OIDC end session endpoint. */
    if (!isFalsyOrWhitespace(customLogoutUrl)) {
      this.windowService.locationReplace(customLogoutUrl);
    }
    // If an OIDC standard end session endpoint is configured, then navigate via userManager
    this.userManager.metadataService.getEndSessionEndpoint().then(url => {
      if (!isFalsyOrWhitespace(url)) {
        this.userManager.signoutRedirect();
      }
      // If there's no custom logout url or OIDC standard end session endpoint, then do nothing.
    });
  }

  public logIn(): void {
    this.userManager.signinRedirect();
  }
}
