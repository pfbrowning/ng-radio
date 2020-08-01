import { Action, createReducer, on } from '@ngrx/store';
import { AuthenticationState } from './models/authentication-state';
import { initialAuthenticationState } from './models/initial-authentication-state';
import { AuthenticationActions } from '.';

const reducer = createReducer<AuthenticationState>(
  initialAuthenticationState,
  on(
    AuthenticationActions.initializeSucceeded,
    AuthenticationActions.silentRefreshSucceeded,
    (state, { email, accessToken, authenticated }) => ({
      ...state,
      email,
      accessToken,
      authenticated
    })),
  on(AuthenticationActions.initializeSucceeded, AuthenticationActions.initializeFailed, state => ({
    ...state,
    initialized: true
  })),
  on(AuthenticationActions.accessTokenExpired, state => ({
    ...state,
    authenticated: false
  })),
);

export function authenticationReducer(state: AuthenticationState | undefined, action: Action) {
  return reducer(state, action);
}
