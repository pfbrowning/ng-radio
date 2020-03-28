import { Injectable } from '@angular/core';
import { ReplaySubject, timer } from 'rxjs';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { NotificationService, Severities } from '@notifications';
import { ErrorHandlingService } from '@error-handling';
import { ConfigService } from '@config';
import { LoggingService } from '@logging';
import * as moment from 'moment';

@Injectable()
export class AuthenticationService {
  private readonly tokenProcessed = new ReplaySubject<void>(1);
  private readonly oAuthEvents = new ReplaySubject<OAuthEvent>(10);
  public tokenProcessed$ = this.tokenProcessed.asObservable();
  public oAuthEvents$ = this.oAuthEvents.asObservable();

  constructor(private oauthService: OAuthService,
    private errorHandlingService: ErrorHandlingService,
    private notificationService: NotificationService,
    private loggingService: LoggingService,
    private configService: ConfigService) {
      // Initialize the oauth service with our loaded auth config settings
      this.oauthService.configure(this.configService.appConfig.authConfig);

      /* Load the configuration from the discovery document and process the provided
      ID token if present.  Afterwards, emit to tokenProcessed so that subscribers
      know that the token has been processed.*/
      this.oauthService.loadDiscoveryDocumentAndTryLogin()
        .then(() => {
          this.oauthService.setupAutomaticSilentRefresh();
          this.tokenProcessed.next();
        })
        .catch(error => this.errorHandlingService.handleError(error, 'Failed to process login'));

      // Pass oauth events to the onOauthEvent handler
      this.oauthService.events.subscribe(event => this.onOauthEvent(event));
  }

  /** Redirects the user to the oidc provider login page for implicit flow */
  public initImplicitFlow(): void {
    this.oauthService.initImplicitFlow();
  }

  /** Initiates logout as implemented by angular-oauth2-oidc */
  public logOut(): void {
    this.oauthService.logOut();
  }

  /** Handler for OAuth Events emitted by angular-oauth2-oidc */
  private onOauthEvent(oAuthEvent: OAuthEvent) {
    // Forward OAuth events to a ReplaySubject for late subscribers
    this.oAuthEvents.next(oAuthEvent);
    // Log all events for diagnostics and troubleshooting
    this.loggingService.logInformation('OAuth Event', oAuthEvent);

    switch (oAuthEvent.type) {
      // When the silent refresh fails
      case 'silent_refresh_timeout':
      case 'silent_refresh_error':
        /* Notify the user, give them a few seconds to read the notification, then
        redirect for login.  I don't expect this to happen regularly, but if it does
        become an issue then it would be better to show the user a modal which
        informs them of what happened and gives them a 'log in again' button to click
        in order to ensure that the user saw the message. */
        this.notificationService.notify(Severities.Error, 'Silent Refresh Failed',
          `Logged out due to silent refresh failure.  This should not happen regularly.
          Redirecting you back to the identity provider for login.`);
        timer(6000).subscribe(() => this.initImplicitFlow());
        break;
    }

  }

  /** Explicitly initiate silent refresh */
  public silentRefresh(): Promise<OAuthEvent> {
    return this.oauthService.silentRefresh();
  }

  /** Tells whether the user is currently authenticated with a valid, non-expired tokens */
  public get authenticated(): boolean {
    return this.oauthService.hasValidIdToken() && this.oauthService.hasValidAccessToken();
  }

  /** Claims included in the id token */
  public get idTokenClaims(): Object {
    return this.oauthService.getIdentityClaims();
  }

  /** Expiration date of the access token */
  public get accessTokenExpiration(): moment.Moment {
    return moment(this.oauthService.getAccessTokenExpiration());
  }

  /** Expiration date of the id token */
  public get idTokenExpiration(): moment.Moment {
    return moment(this.oauthService.getIdTokenExpiration());
  }

  /** Reports whether the id token is currently expired */
  public get idTokenExpired(): boolean {
    return this.idTokenExpiration.isBefore(this.currentDate);
  }

  /** Reports whether the access token is currently expired */
  public get accessTokenExpired(): boolean {
    return this.accessTokenExpiration.isBefore(this.currentDate);
  }

  /** Reports the number of seconds until (or since, if negative)
   * the expiration of the id token */
  public get idTokenExpiresIn(): number {
    return this.idTokenExpiration.diff(this.currentDate, 'seconds');
  }

  /** Reports the number of seconds until (or since, if negative)
   * the expiration of the access token */
  public get accessTokenExpiresIn(): number {
    return this.accessTokenExpiration.diff(this.currentDate, 'seconds');
  }

  /** Private helper method which returns the current date for
   * expiration-related calculations */
  public get currentDate(): moment.Moment {
    return moment();
  }
}
