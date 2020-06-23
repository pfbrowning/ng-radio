import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { provideMockStore } from '@ngrx/store/testing';
import { CoreSpyFactories } from '@core/testing';
import { initialRootState } from '../../models/initial-root-state';
import { AuthenticationService } from './authentication.service';
import { AuthenticationServiceStub } from '../../testing/stubs/authentication-service-stub.spec';
import { hot, cold } from 'jasmine-marbles';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let authenticationService: AuthenticationServiceStub;

  beforeEach(() => {
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
  });

  it('should allow entry for an authenticated user', () => {
    // Arrange
    authenticationService.authenticated$ = hot('-(a|)', { a: true });

    // Act & Assert
    expect(authGuardService.canActivate()).toBeObservable(cold('-(a|)', { a: true }));
    expect(oauthService.initCodeFlow).not.toHaveBeenCalled();
  });

  it('should redirect and never complete canActivate for a non-authenticated user', () => {
    // Arrange
    authenticationService.authenticated$ = hot('-(a|)', { a: false });

    // Act & Assert
    expect(authGuardService.canActivate()).toBeObservable(cold('--'));
    expect(oauthService.initCodeFlow).toHaveBeenCalledTimes(1);
  });
});
