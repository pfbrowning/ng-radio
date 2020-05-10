import { Action, createReducer, on } from '@ngrx/store';
import {
  initializeSucceeded,
  initializeFailed,
  silentRefreshSucceeded,
  idTokenExpired,
  accessTokenExpired
} from './authentication.actions';
import { initialAuthenticationState } from '../../models/authentication/initial-authentication-state';
import { AuthenticationState } from '../../models/authentication/authentication-state';

const reducer = createReducer<AuthenticationState>(
  initialAuthenticationState,
  on(initializeSucceeded, (state, { idToken, accessToken, idTokenExpiration, accessTokenExpiration, authenticated, email }) => ({
    ...state,
    idToken,
    accessToken,
    idTokenExpiration,
    accessTokenExpiration,
    authenticated,
    email,
    initialized: true
  })),
  on(initializeFailed, state => ({
    ...state,
    initialized: true
  })),
  on(silentRefreshSucceeded, (state, { idToken, accessToken, idTokenExpiration, accessTokenExpiration }) => ({
    ...state,
    idToken,
    accessToken,
    idTokenExpiration,
    accessTokenExpiration,
  })),
  on(idTokenExpired, accessTokenExpired, state => ({
    ...state,
    authenticated: false
  })),
);

export function authenticationReducer(state: AuthenticationState | undefined, action: Action) {
  return reducer(state, action);
}
