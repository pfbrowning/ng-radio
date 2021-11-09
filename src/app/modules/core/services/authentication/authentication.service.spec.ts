import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './authentication.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';
import { ConfigService } from '@core/services';
import { CoreSpyFactories } from '@core/testing';
import { ConfigStubService } from '../../testing/stubs/config-stub-service.spec';
import { WindowService } from '../browser-apis/window.service';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: initialRootState }),
        { provide: ConfigService, useClass: ConfigStubService },
        {
          provide: WindowService,
          useValue: CoreSpyFactories.createWindowServiceSpy(),
        },
      ],
    });
    authenticationService = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(authenticationService).toBeTruthy();
  });
});
