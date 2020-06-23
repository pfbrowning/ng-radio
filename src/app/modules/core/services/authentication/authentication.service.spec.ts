import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { RootState } from '../../models/root-state';
import { AuthenticationSelectors } from '../../store/authentication';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let store: MockStore<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    });
    authenticationService = TestBed.inject(AuthenticationService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });

  describe('authenticated$', () => {
    it('should wait until auth initializes before emitting and completing', fakeAsync(() => {
      // Arrange
      const authenticatedSpy = jasmine.createSpyObj('authenticated$', [ 'next', 'complete' ]);
      authenticationService.authenticated$.subscribe({
        next: val => authenticatedSpy.next(val),
        complete: () => authenticatedSpy.complete()
      });
      expect(authenticatedSpy.next).not.toHaveBeenCalled();

      // Act
      tick(200);
      store.overrideSelector(AuthenticationSelectors.initializationState, { initialized: true, authenticated: true });
      store.refreshState();

      // Assert
      expect(authenticatedSpy.next).toHaveBeenCalledTimes(1);
      expect(authenticatedSpy.next.calls.mostRecent().args[0]).toBe(true);
      expect(authenticatedSpy.complete).toHaveBeenCalledTimes(1);
    }));
  });
});
