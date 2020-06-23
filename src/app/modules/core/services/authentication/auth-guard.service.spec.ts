import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { RootState } from '../../models/root-state';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CoreSpyFactories } from '@core/testing';
import { initialRootState } from '../../models/initial-root-state';
import { initialAuthenticationState } from '../../models/authentication/initial-authentication-state';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceStub } from '../../testing/stubs/authentication-service-stub.spec';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let canActivateSpy;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let authenticationService: AuthenticationServiceStub;

  beforeEach(() => {
    canActivateSpy = jasmine.createSpyObj('canActivate', ['next', 'error', 'complete']);
    oauthService = CoreSpyFactories.createOAuthServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState}),
        { provide: OAuthService, useValue: oauthService },
        { provide: AuthenticationService, useClass: AuthenticationServiceStub }
      ]
    });

    authGuardService = TestBed.inject(AuthGuardService);
    authenticationService = TestBed.inject(AuthenticationService) as any;

    authGuardService.canActivate().subscribe(
      value => canActivateSpy.next(value),
      error => canActivateSpy.error(error),
      () => canActivateSpy.complete()
    );
  });

  it('should allow entry for an authenticated user', () => {
    expect(canActivateSpy.next).not.toHaveBeenCalled();

    // Arrange & Act
    authenticationService.authenticatedSubject.next(true);

    // Assert: Ensure that 'true' was emitted and that we didn't redirect
    expect(canActivateSpy.next).toHaveBeenCalledTimes(1);
    expect(canActivateSpy.next.calls.mostRecent().args[0]).toBe(true);
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).toHaveBeenCalledTimes(1);
    expect(oauthService.initCodeFlow).not.toHaveBeenCalled();
  });

  it('should redirect and never complete canActivate for a non-authenticated user', () => {
    // Arrange & Act
    authenticationService.authenticatedSubject.next(false);

    // Assert: Ensure that 'true' was emitted and that we initiated redirect to IDP
    expect(canActivateSpy.next).not.toHaveBeenCalled();
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).not.toHaveBeenCalled();
    expect(oauthService.initCodeFlow).toHaveBeenCalledTimes(1);
  });
});
