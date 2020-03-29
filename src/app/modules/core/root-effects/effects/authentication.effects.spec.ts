import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';
import { initialRootState } from '@root-state';
import { AuthenticationEffects } from './authentication.effects';

describe('AuthenticationEffects', () => {
  const actions$: Observable<any> = null;
  let effects: AuthenticationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialRootState }),
      ]
    });

    effects = TestBed.inject<AuthenticationEffects>(AuthenticationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
