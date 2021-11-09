import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { provideMockStore } from '@ngrx/store/testing';
import { CoreSpyFactories } from '@core/testing';
import { initialRootState } from '../../models/initial-root-state';
import { hot, cold } from 'jasmine-marbles';
import { AuthenticationFacadeService } from '../../store/authentication/authentication-facade.service';

describe('AuthGuardService', () => {
  let authGuardService: AuthGuardService;
  let authenticationFacade: jasmine.SpyObj<AuthenticationFacadeService>;

  beforeEach(() => {
    authenticationFacade = CoreSpyFactories.createAuthenticationFacadeSpy();

    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: initialRootState }),
        {
          provide: AuthenticationFacadeService,
          useValue: authenticationFacade,
        },
      ],
    });

    authGuardService = TestBed.inject(AuthGuardService);
  });

  it('should allow entry for an authenticated user', () => {
    // Arrange
    authenticationFacade.authenticated$ = hot('-(a|)', { a: true });

    // Act & Assert
    expect(authGuardService.canActivate()).toBeObservable(cold('-(a|)', { a: true }));
    expect(authenticationFacade.logInRedirect).not.toHaveBeenCalled();
  });

  it('should redirect and never complete canActivate for a non-authenticated user', () => {
    // Arrange
    authenticationFacade.authenticated$ = hot('-(a|)', { a: false });

    // Act & Assert
    expect(authGuardService.canActivate()).toBeObservable(cold('--'));
    expect(authenticationFacade.logInRedirect).toHaveBeenCalledTimes(1);
  });
});
