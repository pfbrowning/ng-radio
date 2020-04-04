import { TestBed } from '@angular/core/testing';
import { BearerTokenService } from './bearer-token.service';
import { initialRootState } from '../models/initial-root-state';
import { provideMockStore } from '@ngrx/store/testing';

describe('BearerTokenService', () => {
  let service: BearerTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BearerTokenService,
        provideMockStore({initialState: initialRootState})
      ]
    });
    service = TestBed.inject(BearerTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
