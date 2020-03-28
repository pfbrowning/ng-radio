import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationServiceStub } from '../testing/authentication.service-stub.spec';

describe('AuthGuard', () => {
  let authenticationService: AuthenticationServiceStub;
  let authGuard: AuthGuard;
  let canActivateSpy;

  beforeEach(() => {
    authenticationService = new AuthenticationServiceStub();
    canActivateSpy = jasmine.createSpyObj('canActivate', ['emit', 'error', 'complete']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authenticationService },
      ]
    });

    authGuard = TestBed.inject(AuthGuard);

    authGuard.canActivate().subscribe(
      value => canActivateSpy.emit(value),
      error => canActivateSpy.emit(error),
      () => canActivateSpy.complete()
    );
  });

  it('should allow entry for an authenticated user', () => {
    // Arrange: Set authenticated to true
    authenticationService.authenticated = true;
    expect(canActivateSpy.emit).not.toHaveBeenCalled();

    // Act: Emit from tokenProcessed$ to simulate the corresponding auth event
    authenticationService.tokenProcessed$.next();

    // Assert: Ensure that 'true' was emitted and that we didn't call initImplicitFlow
    expect(canActivateSpy.emit).toHaveBeenCalledTimes(1);
    expect(canActivateSpy.emit.calls.mostRecent().args[0]).toBe(true);
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).not.toHaveBeenCalled();
    expect(authenticationService.initImplicitFlowSpy).not.toHaveBeenCalled();
  });

  it('should init implicit flow for a non-authenticated user', () => {
    // Arrange: Set authenticated to false
    authenticationService.authenticated = false;
    expect(canActivateSpy.emit).not.toHaveBeenCalled();

    // Act: Emit from tokenProcessed$ to simulate the corresponding auth event
    authenticationService.tokenProcessed$.next();

    // Assert: Ensure that 'true' was emitted and that we didn't call initImplicitFlow
    expect(canActivateSpy.emit).toHaveBeenCalledTimes(1);
    expect(canActivateSpy.emit.calls.mostRecent().args[0]).toBe(false);
    expect(canActivateSpy.error).not.toHaveBeenCalled();
    expect(canActivateSpy.complete).not.toHaveBeenCalled();
    expect(authenticationService.initImplicitFlowSpy).toHaveBeenCalledTimes(1);
  });
});
