import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { UserManager, User } from 'oidc-client';
import { Observable, Subject } from 'rxjs';
import { ConfigService } from '../config.service';
import { WindowService } from '../browser-apis/window.service';
import { isFalsyOrWhitespace } from '@utilities';
import { TokenReceivedResult } from '../../models/authentication/token-received-result';

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

  constructor(private configService: ConfigService, private windowService: WindowService) { }

  public initialize(): Observable<TokenReceivedResult> {
    return this.configService.appConfig$.pipe(
      tap(config => {
        this.userManager = new UserManager(config.authConfig.userManager);
        this.registerEvents();
      }),
      switchMap(() => this.userManager.getUser()),
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

  public logOut(): void {
    this.configService.appConfig$.subscribe(config => {
      this.userManager.removeUser();
      /* Do we care to handle updating the store for the "can't redirect because logoutUrl
      isn't provided" scenario?  Will this ever actually happen? */
      if (!isFalsyOrWhitespace(config.authConfig.logoutUrl)) {
        /* Auth0 doesn't publish an OIDC standard end session endpoint
        so we have to navigate manully. */
        this.windowService.locationReplace(config.authConfig.logoutUrl);
      }
    });
  }

  public logIn(): void {
    this.userManager.signinRedirect();
  }
}
