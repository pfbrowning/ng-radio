import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthenticationFacadeService } from './authentication-facade.service';
import { initialRootState } from '../../models/initial-root-state';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RootState } from '../../models/root-state';
import { AuthenticationSelectors } from '.';

describe('AuthenticationFacadeService', () => {
  let authenticationFacade: AuthenticationFacadeService;
  let store: MockStore<RootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    });
    authenticationFacade = TestBed.inject(AuthenticationFacadeService);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should be created', () => {
    expect(authenticationFacade).toBeTruthy();
  });

  describe('authenticated$', () => {
    it('should wait until auth initializes before emitting and completing', fakeAsync(() => {
      // Arrange
      const authenticatedSpy = jasmine.createSpyObj('authenticated$', [ 'next', 'complete' ]);
      authenticationFacade.authenticated$.subscribe({
        next: val => authenticatedSpy.next(val),
        complete: () => authenticatedSpy.complete()
      });
      expect(authenticatedSpy.next).not.toHaveBeenCalled();

      // Act
      tick(200);
      store.overrideSelector(AuthenticationSelectors.authenticationState, {
        initialized: true,
        authenticated: true,
        email: '123@fake.com',
        accessToken: 'mockToken'
      });
      store.refreshState();

      // Assert
      expect(authenticatedSpy.next).toHaveBeenCalledTimes(1);
      expect(authenticatedSpy.next.calls.mostRecent().args[0]).toBe(true);
      expect(authenticatedSpy.complete).toHaveBeenCalledTimes(1);
    }));
  });
});
