import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication.service';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '../../models/initial-root-state';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({initialState: initialRootState})
      ]
    });
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
