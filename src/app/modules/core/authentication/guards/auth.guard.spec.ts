import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState, RootState } from '@root-state';
import { Store } from '@ngrx/store';
import { initialAuthenticationState } from '@root-state/authentication';
import { OAuthService } from 'angular-oauth2-oidc';
import { createOAuthServiceSpy } from '../testing/authentication-spy-factories.spec';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let canActivateSpy;
  let oauthService: jasmine.SpyObj<OAuthService>;
  let store: MockStore<RootState>;

  beforeEach(() => {
    canActivateSpy = jasmine.createSpyObj('canActivate', ['emit', 'error', 'complete']);
    oauthService = createOAuthServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        provideMockStore({initialState: initialRootState}),
        { provide: OAuthService, useValue: oauthService }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
    store = TestBed.inject(MockStore);

    authGuard.canActivate().subscribe(
      value => canActivateSpy.emit(value),
      error => canActivateSpy.emit(error),
      () => canActivateSpy.complete()
    );
  });

  it('should allow entry for an authenticated user', () => {
    expect(canActivateSpy.emit).not.toHaveBeenCalled();

    // Arrange & Act
    store.setState({
      ...initialRootState,
      authentication: {
        ...initialAuthenticationState,
        initialized: true,
        authenticated: true
      }
    });

    // Assert: Ensure that 'true' was emitted and that we didn't call initImplicitFlow
    expect(canActivateSpy.emit).toHaveBeenCalledTimes(1);
    expect(canActivateSpy.emit.calls.mostRecent().args[0]).toBe(true);
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).not.toHaveBeenCalled();
    expect(oauthService.initImplicitFlow).not.toHaveBeenCalled();
  });

  it('should init implicit flow for a non-authenticated user', () => {
    expect(canActivateSpy.emit).not.toHaveBeenCalled();

    // Arrange & Act
    store.setState({
      ...initialRootState,
      authentication: {
        ...initialAuthenticationState,
        initialized: true,
        authenticated: false
      }
    });

    // Assert: Ensure that 'true' was emitted and that we didn't call initImplicitFlow
    expect(canActivateSpy.emit).toHaveBeenCalledTimes(1);
    expect(canActivateSpy.emit.calls.mostRecent().args[0]).toBe(false);
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).not.toHaveBeenCalled();
    expect(oauthService.initImplicitFlow).toHaveBeenCalledTimes(1);
  });
});
